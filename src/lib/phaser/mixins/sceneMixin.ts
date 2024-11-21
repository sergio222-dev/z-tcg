import { Scene, GameObjects, Structs } from "phaser";
import GameObject = GameObjects.GameObject;

type Constructor<T = Scene> = new (...args: any[]) => T

type AnyGameObject = GameObject | Structs.List<GameObject>

type FactoryCall<T extends AnyGameObject = AnyGameObject | Structs.List<GameObject>> = (...args: any[]) => T

export type FactoryConfiguration = {
  name: string,
  factory: FactoryCall
}

export function SceneMixin<TBase extends Constructor>(Base: TBase) {

  return class SceneMixin extends Base {

    private static registeredFactories = new Map();

    static registerFactory( config: FactoryConfiguration | FactoryConfiguration[]) {

      if (!Array.isArray(config)) {
        SceneMixin.registerSingleFactory(config)
        return;
      }

      config.forEach(c => {
        SceneMixin.registerSingleFactory(c)
      })
    }

    private static registerSingleFactory(config: FactoryConfiguration) {
      if (SceneMixin.registeredFactories.has(config.name)) {
        return;
      }

      SceneMixin.registeredFactories.set(config.name, config.factory)
    }

    addAny<T extends AnyGameObject >(name: string, ...args: any[]): T {
      // check if the factory exists
      if (!SceneMixin.registeredFactories.has(name)) {
        throw new Error(`No factory registered with name "${name}"`);
      }

      const factory = SceneMixin.registeredFactories.get(name);

      const gameObject = factory.call(this, ...args) as T;

      if (!this.isGameObject(gameObject)) {
        throw new Error(`The factory registered with name "${name}" is not returning a GameObject`);
      }

      this.sys.displayList.add(gameObject);

      return gameObject;
    }

    private isGameObject(obj: AnyGameObject | undefined): obj is GameObject {
      return typeof obj !== 'undefined';

    }
  }
}

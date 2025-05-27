import {Injectable} from '@angular/core';
import {IDBPDatabase, openDB} from 'idb';
import {
  dbAuthStore,
  dbBusinessConfig,
  dbBusinessInfo,
  dbClientsStore,
  dbConektaClientsStore,
  dbConektaReferencesStore,
  dbContractsStore,
  dbDynamicAccountStore,
  dbDynamicReferencesStore,
  dbIndexAuth,
  dbIndexBusiness,
  dbIndexConektaClientsRef,
  dbIndexNotification,
  dbIndexPassportClientsRef,
  dbIndexPayments,
  dbName,
  dbNotificationsStore,
  dbPassportReferencesStore,
  dbPaymentsStore,
  dbVersion,
  keyPathCurp,
  keyPathDynamicReference,
  keyPathId,
  keyUserID
} from "../utils/config";
import {oUser} from '../interfaces/oUser';
import {oClient} from '../interfaces/oClient';
import {cTyClientContract, tyClientContract} from '../interfaces/oGlobal';
import {oContract} from '../interfaces/oContract';
import {oBusinessConfig, oBusinessInfo} from '../interfaces/oBusiness';
import {oNotification} from '../interfaces/oNotification';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  indexDbStatus = false
  iDb!: IDBPDatabase<unknown>

  constructor() {
    if (('indexedDB' in window)) {
      this.indexDbStatus = true
      this.initDB().then()
    }
  }

  async initDB() {
    this.iDb = await openDB(dbName, dbVersion, {
      upgrade(db: IDBPDatabase) {

        if (!db.objectStoreNames.contains(dbAuthStore)) {
          db.createObjectStore(
            dbAuthStore,
            {keyPath: "id", autoIncrement: true}
          ).createIndex(dbIndexAuth, dbIndexAuth, {unique: true})
        }

        // if (!db.objectStoreNames.contains(dbUsersStore)) {
        //   db.createObjectStore(
        //     dbUsersStore,
        //     {keyPath: "id", autoIncrement: true}
        //   ).createIndex(dbIndexUsers, dbIndexUsers, {unique: true})
        // }

        if (!db.objectStoreNames.contains(dbContractsStore)) {
          const storeContract = db.createObjectStore(
            dbContractsStore,
            {keyPath: keyPathId, autoIncrement: true}
          )
          storeContract.createIndex(keyPathId, keyPathId, {unique: true})
        }

        if (!db.objectStoreNames.contains(dbClientsStore)) {
          const storeClient = db.createObjectStore(
            dbClientsStore,
            {keyPath: [keyPathId, keyPathCurp], autoIncrement: false}
          )
          storeClient.createIndex(keyPathId, keyPathId, {unique: true})
          storeClient.createIndex(keyPathCurp, keyPathCurp, {unique: true})
        }

        if (!db.objectStoreNames.contains(dbConektaClientsStore)) {
          const storeConekta = db.createObjectStore(
            dbConektaClientsStore,
            {keyPath: [keyPathId, keyPathCurp], autoIncrement: false}
          )
          storeConekta.createIndex(keyPathId, keyPathId, {unique: true})
          storeConekta.createIndex(keyPathCurp, keyPathCurp, {unique: true})
        }

        if (!db.objectStoreNames.contains(dbConektaReferencesStore)) {
          db.createObjectStore(
            dbConektaReferencesStore,
            {keyPath: "id", autoIncrement: true}
          ).createIndex(dbIndexConektaClientsRef, dbIndexConektaClientsRef, {unique: true})
        }

        if (!db.objectStoreNames.contains(dbDynamicAccountStore)) {
          db.createObjectStore(
            dbDynamicAccountStore,
            {keyPath: keyPathId, autoIncrement: false}
          ).createIndex(keyPathId, keyPathId, {unique: true})
        }

        if (!db.objectStoreNames.contains(dbDynamicReferencesStore)) {
          const objectStore = db.createObjectStore(
            dbDynamicReferencesStore,
            {keyPath: [keyPathId, keyPathDynamicReference], autoIncrement: false}
          )
          objectStore.createIndex(keyPathId, keyPathId, {unique: true})
          objectStore.createIndex(keyPathDynamicReference, keyPathDynamicReference, {unique: true})
        }

        if (!db.objectStoreNames.contains(dbPassportReferencesStore)) {
          db.createObjectStore(
            dbPassportReferencesStore,
            {keyPath: "id", autoIncrement: true}
          ).createIndex(dbIndexPassportClientsRef, dbIndexPassportClientsRef, {unique: true})
        }

        if (!db.objectStoreNames.contains(dbBusinessInfo)) {
          db.createObjectStore(
            dbBusinessInfo,
            {keyPath: "version"}
          ).createIndex(dbIndexBusiness, dbIndexBusiness, {unique: true})
        }

        if (!db.objectStoreNames.contains(dbBusinessConfig)) {
          db.createObjectStore(
            dbBusinessConfig,
            {keyPath: "version"}
          ).createIndex(dbIndexBusiness, dbIndexBusiness, {unique: true})
        }

        if (!db.objectStoreNames.contains(dbNotificationsStore)) {
          db.createObjectStore(
            dbNotificationsStore,
            {keyPath: "notification_id"}
          ).createIndex(dbIndexNotification, dbIndexNotification, {unique: true})
        }

        if (!db.objectStoreNames.contains(dbPaymentsStore)) {
          db.createObjectStore(
            dbPaymentsStore,
            {keyPath: "id"}
          ).createIndex(dbIndexPayments, dbIndexPayments, {unique: true})
        }
      }
    })
  }

  async dbAuthorization() {
    const k = this.getLocalUser()
    if (k == null) return false

    const db = await openDB(dbName, dbVersion)
    // utils store = db.transaction(dbUsersStore).objectStore(dbUsersStore)
    const auth = await db.get(dbAuthStore, k)
    // utils auth = await store.get(k)
    db.close()

    return auth;
  }

  getLocalUser(): string | null {
    const k = localStorage.getItem(keyUserID)
    return (k)
  }

  async dbSignIn(store: string, data: any) {
    await this.iDb.put(store, data)
    const _data = data as oUser
    this.setLocalStorage(keyUserID, _data.id)
  }

  setLocalStorage(k: string, v: string) {
    localStorage.setItem(k, v)
  }

  getLocalStorage<T>(k: string) {
    return localStorage.getItem(k) as T
  }

  async dbGetPlatformUser() {
    const k = this.getLocalUser()
    if (k == null) return ""

    const db = await openDB(dbName, dbVersion)
    // utils store = db.transaction(dbUsersStore).objectStore(dbUsersStore)
    const auth = await db.get(dbAuthStore, k) as oUser
    // utils auth = await store.get(k)

    db.close()
    return auth.name != "" ? auth.name : ""
  }

  async GetToken() {
    const k = this.getLocalUser()
    if (k == null) return ""

    const db = await openDB(dbName, dbVersion)
    // utils store = db.transaction(dbUsersStore).objectStore(dbUsersStore)
    const auth = await db.get(dbAuthStore, k) as oUser
    // utils auth = await store.get(k)

    db.close()
    return auth.access_token != "" ? auth.access_token : ""
  }

  /************************************************** GENERAL *********************************************************/
  async AddObject<T>(store: string, data: T): Promise<boolean> {
    try {
      const db = await openDB(dbName, dbVersion)
      await db.put(store, data)
      return true
    } catch (e) {
      return false
    }
  }

  async AddAllObjects<T>(store: string, data: T[]): Promise<boolean> {
    try {
      const db = await openDB(dbName, dbVersion)
      const txn = db.transaction(store, "readwrite")
      const obj = txn.objectStore(store)

      data.forEach(item => obj.put(item))
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  async PatchObject<T>(store: string, data: any): Promise<T> {
    try {
      const db = await openDB(dbName, dbVersion)
      const txn = db.transaction(store, "readwrite")
      const obj = txn.objectStore(store)
      // const index = obj.index(keyPathCurp)
      await obj.put(data)
      return data as T
    } catch (e) {
      console.error(e)
      return {} as T
    }
  }

  async UpdateObjectById<T>(store: string, id: string, data: T) {
    const db = await openDB(dbName, dbVersion)
    const res = await db.get(store, id) as oClient

    if (res.id != "") await this.RemoveObject(dbClientsStore, id)

    return await this.AddObject(store, data)
  }

  async UpsertObjectById<T>(store: string, id: string, data: T): Promise<boolean> {
    try {
      const db = await openDB(dbName, dbVersion)
      const res = await db.get(store, id)

      if (res) await this.RemoveObject<T>(store, id)

      let e = await db.add(store, data)
      return e ? true : false

    } catch (e) {
      console.log("UpsertObjectById", e)
      return false
    }
  }

  async GetObject<T>(store: string, data: any): Promise<T> {
    if (!data) return data
    const db = await openDB(dbName, dbVersion)
    return await db.get(store, data) as T
  }

  async GetDynamicReference<T>(store: string, id: string) {
    try {
      const db = await openDB(dbName, dbVersion)
      const txn = db.transaction(store, "readwrite")
      const obj = txn.objectStore(store)
      const index = obj.index(keyPathDynamicReference)
      const va2 = await index.get(id)
      return va2 as T
    } catch (e) {
      console.error(e)
      return {} as T
    }
  }

  async GetObjectByID<T>(
    store: string,
    id: string,
    primaryKey: string = keyPathId
  ) {
    try {
      const db = await openDB(dbName, dbVersion)
      const txn = db.transaction(store, "readwrite")
      const obj = txn.objectStore(store)
      const index = obj.index(primaryKey)
      const va2 = await index.get(id)
      return va2 as T
    } catch (e) {
      console.error(e)
      return {} as T
    }
  }

  async cleanAll<T>(store: string) {
    const db = await openDB(dbName, dbVersion)
    return await db.clear(store)
  }

  async UpdateObject<T>(store: string, data: any) {
    const db = await openDB(dbName, dbVersion)
    await db.put(store, data)
  }

  async dbAddBuildByStore(store: string, data: any[]) {
    for (const o of data) {
      const exists = await this.GetObject(store, o["id"])
      if (!exists) await this.AddObject(store, o)
      else await this.UpdateObject(store, o)
    }
  }

  async dbDeleteObjectByID<T>(store: string, id: string) {
    try {
      const db = await openDB(dbName, dbVersion)
      const txn = db.transaction(store, "readwrite")
      const obj = txn.objectStore(store)
      const index = obj.index(keyPathId)
      const va2 = index.openCursor(id)
      va2.then(async cursor => {
        while (cursor) {
          cursor.delete();
          cursor = await cursor.continue();
        }
      })
      return va2
    } catch (e) {
      console.error(e)
      return {} as T
    }
  }

  async RemoveObject<T>(store: string, data: any): Promise<T> {
    const db = await openDB(dbName, dbVersion)
    return await db.delete(store, data) as T
  }

  async GetAllByStore<T>(store: string, index?: string) {
    const db = await openDB(dbName, dbVersion)
    return await db.getAll(store) as T
  }

  /******************** MERGE **************************************/

  // async dbGetAllClientContract(): Promise<tyClientContract[]> {
  //   const clientContract: tyClientContract[] = []
  //   const clients = await this.dbGetAllByStore<oClient[]>(dbClientsStore)
  //   if (clients.length == 0) return []
  //
  //   for (let client of clients) {
  //     const contract = await this.dbGetObject<oContract>(dbContractsStore, client.contract)
  //     const e = {...client, ...contract}
  //     // preserve the id value over concat models
  //     e.id = client.id
  //     e.status = client.status
  //     clientContract.push(e)
  //   }
  //   return clientContract
  // }

  /**************** NOTIFICATIONS *********************************/

  async getLocalNotifications(): Promise<oNotification[]> {
    const _notifications: oNotification[] = await this.GetAllByStore<oNotification[]>(dbNotificationsStore)
    if (!_notifications) return []
    return _notifications
  }

  async updateNotifications(notifications: oNotification[]) {
    for (const o of notifications) {
      const exists = await this.GetObject(dbNotificationsStore, o.notification_id)
      if (!exists) {
        await this.AddObject(dbNotificationsStore, o)
      }
    }
  }

  /******************** MERGE **************************************/

  async GetClientContract(clientId: string): Promise<tyClientContract> {
    try {

      let clientContract: tyClientContract = cTyClientContract

      const client = await this.GetObjectByID<oClient>(dbClientsStore, clientId)
      if (client == undefined) return clientContract

      const contract = await this.GetObjectByID<oContract>(dbContractsStore, client.contract!)
      if (contract == undefined) return clientContract

      clientContract = {...client, ...contract}
      clientContract.id = client.id
      clientContract.status = client.status

      return clientContract
    } catch (e) {
      console.log("dbGetClientContract : Catch error \n", e)
      return cTyClientContract
    }
  }

  /****************** BUSINESS INFO *************************************/

  async GetBusinessInfo(): Promise<oBusinessInfo | null> {
    const config: oBusinessInfo[] = await this.GetAllByStore<oBusinessInfo[]>(dbBusinessInfo)

    if (!config) return null

    return config[0]
  }

  async UpdateBusinessInfo(config: oBusinessInfo) {

    config.version = "v2024"
    await this.RemoveObject(dbBusinessInfo, "v2024")
    await this.AddObject(dbBusinessInfo, config)
  }

  /****************** BUSINESS CONFIG ************************************/

  async GetBusinessConfig(): Promise<oBusinessConfig | null> {
    const config: oBusinessConfig[] = await this.GetAllByStore<oBusinessConfig[]>(dbBusinessConfig)

    if (!config) return null

    return config[0]
  }

  async UpdateBusinessConfig(config: oBusinessConfig) {

    // config.version = "1.0"
    await this.RemoveObject(dbBusinessConfig, "1.0")
    await this.AddObject(dbBusinessConfig, config)
  }

  async SignOut() {

    const k = this.getLocalUser()
    if (!k) return

    await this.iDb.delete(dbAuthStore, k)
    this.removeLocalStorage(keyUserID)
  }

  async deleteLocalDb() {
    try {
      const idb = await openDB(dbName, dbVersion)
      await idb.clear(dbAuthStore)
      await idb.clear(dbBusinessConfig)
      await idb.clear(dbBusinessInfo)
      await idb.clear(dbClientsStore)
      await idb.clear(dbContractsStore)
      await idb.clear(dbDynamicReferencesStore)
      await idb.clear(dbDynamicAccountStore)
      await idb.clear(dbPaymentsStore)
      await idb.clear(dbNotificationsStore)
      await idb.clear(dbPassportReferencesStore)
      await idb.clear(dbConektaClientsStore)
      await idb.clear(dbConektaReferencesStore)
    } catch (e) {
      console.info(e)
    }
  }

  removeLocalStorage(k: string) {
    localStorage.removeItem(k)
  }
}

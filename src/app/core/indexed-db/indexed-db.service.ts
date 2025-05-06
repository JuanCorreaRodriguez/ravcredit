import { Injectable } from '@angular/core';
import {IDBPDatabase, openDB} from 'idb';import {
  dbAuthStore,
  dbBusinessConfig,
  dbBusinessInfo,
  dbClientsStore,
  dbConektaClientsStore,
  dbConektaReferencesStore,
  dbContractsStore,
  dbDynamicReferencesStore,
  dbIndexAuth,
  dbIndexBusiness,
  dbIndexConektaClientsRef,
  dbIndexNotification,
  dbIndexPassportClientsRef,
  dbIndexPayments,
  dbIndexUsers,
  dbName,
  dbNotificationsStore,
  dbPassportReferencesStore,
  dbPaymentsStore,
  dbUsersStore,
  dbVersion,
  keyPathCurp,
  keyPathId,
  keyPathReference,
  keyUserID
} from "../utils/config";
import {oUser} from '../interfaces/oUser';
import {oClient} from '../interfaces/oClient';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  indexDbStatus = false
  iDb!: IDBPDatabase<unknown>

  constructor() {
    if (('indexedDB' in window)) {
      this.indexDbStatus = true
      // this.initDB().then()
    } else {
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

        if (!db.objectStoreNames.contains(dbUsersStore)) {
          db.createObjectStore(
            dbUsersStore,
            {keyPath: "id", autoIncrement: true}
          ).createIndex(dbIndexUsers, dbIndexUsers, {unique: true})
        }

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

        if (!db.objectStoreNames.contains(dbDynamicReferencesStore)) {
          const storeConekta = db.createObjectStore(
            dbDynamicReferencesStore,
            {keyPath: [keyPathId, keyPathReference], autoIncrement: false}
          )
          storeConekta.createIndex(keyPathId, keyPathId, {unique: true})
          storeConekta.createIndex(keyPathReference, keyPathReference, {unique: true})
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

  getLocalUser() {
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

  async dbGetToken() {
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
  async dbAddObject<T>(store: string, data: any): Promise<boolean> {
    try {
      const db = await openDB(dbName, dbVersion)
      await db.put(store, data)
      return true
    } catch (e) {
      return false
    }
  }

  async dbPatchObject<T>(store: string, data: any): Promise<T> {
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

  async updateObjectByID<T>(store: string, id: string, data: T) {
    const db = await openDB(dbName, dbVersion)
    const res = await db.get(store, id) as oClient

    if (res.id != "") await this.dbRemoveObject(dbClientsStore, id)

    return await this.dbAddObject(store, data)
  }

  async upsertObjectById<T>(store: string, id: string, data: T) {

    const db = await openDB(dbName, dbVersion)
    const res = await db.get(store, id)

    if (res) await this.dbRemoveObject<T>(store, id)

    return await db.add(store, data)
  }

  async dbGetObject<T>(store: string, data: any): Promise<T> {
    if (!data) return data
    const db = await openDB(dbName, dbVersion)
    return await db.get(store, data) as T
  }

  async cleanAll<T>(store: string) {
    const db = await openDB(dbName, dbVersion)
    return await db.clear(store)
  }

  async dbUpdateObject<T>(store: string, data: any) {
    const db = await openDB(dbName, dbVersion)
    await db.put(store, data)
  }

  async dbAddBuildByStore(store: string, data: any[]) {
    for (const o of data) {
      const exists = await this.dbGetObject(store, o["id"])
      if (!exists) await this.dbAddObject(store, o)
      else await this.dbUpdateObject(store, o)
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

  async dbRemoveObject<T>(store: string, data: any): Promise<T> {
    const db = await openDB(dbName, dbVersion)
    return await db.delete(store, data) as T
  }
}

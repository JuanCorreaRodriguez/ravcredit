import { Injectable } from '@angular/core';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import {initializeApp} from 'firebase/app';
import {BehaviorSubject} from 'rxjs';
import {ProgressTaskStatus} from '../utils/UtilContract';
import {oClient} from '../interfaces/oClient';
import {ClientService} from '../services/client.service';

const firebaseConfig = {
  apiKey: "AIzaSyAwRPa0opECp6E5N0jOwusx9PPrsNsTrhM",
  authDomain: "ravcredit-2b079.firebaseapp.com",
  projectId: "ravcredit-2b079",
  storageBucket: "gs://ravcredit-2b079.appspot.com",
  messagingSenderId: "1059462239029",
  appId: "1:1059462239029:web:ffb8d28ed157f80d77327c",
  measurementId: "G-60DW08JVYN",
};

const app = initializeApp(firebaseConfig);

@Injectable({
  providedIn: 'root'
})
export class FirebaseCoreService {

  storage = getStorage();
  uploadProcess: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  uploadStatus = new BehaviorSubject<ProgressTaskStatus>("idle");

  constructor(
    private readonly clientService: ClientService
  ) {
  }

  uploadContract(contract: Blob, client: oClient) {
    this.uploadStatus.next("uploading")

    const storageRef = ref(this.storage, `contracts/${client.id}.pdf`);
    const task = uploadBytesResumable(storageRef, contract)

    task.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

        this.uploadProcess.next(progress)
        this.uploadStatus.next(snapshot.state)
      }, (error) => {
        if (error.message.includes("(storage/unauthorized)")) {
          this.uploadStatus.next("unauthorized")
          return
        }
        this.uploadStatus.next("error")
      }, () => {
        getDownloadURL(task.snapshot.ref).then(async (downloadURL) => {
          client.contractUrl = downloadURL
          await this.updateClient(client)
        })
      }
    )
  }

  async updateClient(client: oClient) {
    return await this.clientService.updateContractUrl(client)
  }
}

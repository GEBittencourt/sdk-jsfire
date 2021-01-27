/* eslint-disable @typescript-eslint/no-explicit-any */
import firebase from 'firebase/app';
import { Observable, of, Subscriber } from 'rxjs';

/**
 * Abstract class that defines a firestore repository with some utilities methods
 * for manipulate a specific collection.
 */
export abstract class FirestoreRepository<Entity extends { id: string }> {
  /** Firestore transaction that already initialized by above layer */
  protected transaction: firebase.firestore.Transaction;

  /** Path to firestore collection */
  abstract collectionPath: string;

  constructor(protected readonly firestore: firebase.firestore.Firestore) {}

  /**
   * Insert a object inside firestore collection. A transaction object is
   * used when it is already defined.
   * @param value Object to be added.
   * @param replacePathValue Values to be replaced inside collection path.
   * Example: collectionPath equals '{0}/products' ({0} will be replaced to received value).
   */
  insert(value: Entity, ...replacePathValue: string[]): Observable<void> {
    const collectionReference = this.firestore.collection(
      this.getCollectionPath(...replacePathValue)
    );
    const documentReference = collectionReference.doc(value.id);
    if (this.transaction) {
      this.transaction.set(documentReference, value);
      return of(null);
    } else {
      return new Observable((observ: Subscriber<void>) => {
        documentReference
          .set(value)
          .then(() => {
            observ.next();
            observ.complete();
          })
          .catch((error: any) => {
            observ.error(error);
          });
      });
    }
  }

  /**
   * Update a object inside firestore collection. A transaction object is
   * used when it is already defined.
   * @param value Object to be updated.
   * @param replacePathValue Values to be replaced inside collection path.
   * Example: collectionPath equals '{0}/products' ({0} will be replaced to received value).
   */
  update(value: Entity, ...replacePathValue: string[]): Observable<void> {
    const collectionReference = this.firestore.collection(
      this.getCollectionPath(...replacePathValue)
    );
    const documentReference = collectionReference.doc(value.id);
    if (this.transaction) {
      this.transaction.update(documentReference, value);
      return of(null);
    } else {
      return new Observable((observ: Subscriber<void>) => {
        documentReference
          .update(value)
          .then(() => {
            observ.next();
            observ.complete();
          })
          .catch((error: any) => {
            observ.error(error);
          });
      });
    }
  }

  /**
   * Delete a object inside firestore collection. A transaction object is
   * used when it is already defined.
   * @param id Object identifier.
   * @param replacePathValue Values to be replaced inside collection path.
   * Example: collectionPath equals '{0}/products' ({0} will be replaced to received value).
   */
  delete(id: string, ...replacePathValue: string[]): Observable<void> {
    const collectionReference = this.firestore.collection(
      this.getCollectionPath(...replacePathValue)
    );
    const documentReference = collectionReference.doc(id);
    if (this.transaction) {
      this.transaction.delete(documentReference);
      return of(null);
    } else {
      return new Observable((observ: Subscriber<void>) => {
        documentReference
          .delete()
          .then(() => {
            observ.next();
            observ.complete();
          })
          .catch((error: any) => {
            observ.error(error);
          });
      });
    }
  }

  /**
   * Find a object inside firestore collection by identifier. A transaction object is
   * used when it is already defined.
   * @param id Object identifier.
   * @param replacePathValue Values to be replaced inside collection path.
   * Example: collectionPath equals '{0}/products' ({0} will be replaced to received value).
   */
  findById(id: string, ...replacePathValue: string[]): Observable<Entity> {
    const collectionReference = this.firestore.collection(
      this.getCollectionPath(...replacePathValue)
    );
    const documentReference = collectionReference.doc(id);
    return new Observable((observ: Subscriber<Entity>) => {
      const findObject = this.transaction
        ? this.transaction.get(documentReference)
        : documentReference.get();
      findObject
        .then(
          (
            document:
              | firebase.firestore.DocumentData
              | firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
          ) => {
            observ.next(
              (document instanceof firebase.firestore.DocumentSnapshot
                ? document.data()
                : document) as Entity
            );
            observ.complete();
          }
        )
        .catch((error: any) => {
          observ.error(error);
        });
    });
  }
  /**
   * Return a collection path replacing the keys by parameters.
   * @param replacePathValue Values to be replaced inside collection path.
   * Example: collectionPath equals '{0}/stock/{1}/items' ({0} will be
   * replaced to first received value and {1} will be replaced to second
   * received value).
   */
  getCollectionPath(...replacePathValue: string[]): string {
    let collectionPath = this.collectionPath;
    replacePathValue.forEach((value: string, index: number) => {
      collectionPath = collectionPath.replace(`{${index}}`, value);
    });
    return collectionPath;
  }
}

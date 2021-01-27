/* eslint-disable @typescript-eslint/no-explicit-any */
import test from 'ava';
import firebase from 'firebase/app';
import { FirestoreRepository } from './firestore-repository';

class EntityClass {
  id: string;
  name: string;
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

class RepositoryClass extends FirestoreRepository<EntityClass> {
  readonly collectionPath = '{0}/items/{1}/entities';
}

class CollectionReferenceMock {
  doc(): firebase.firestore.DocumentReference<EntityClass> {
    return undefined;
  }
}

class FirestoreMock {
  collection(): firebase.firestore.CollectionReference<firebase.firestore.DocumentData> {
    return new CollectionReferenceMock() as any;
  }
}

test('should instance repository class', (t) => {
  const repository = new RepositoryClass(new FirestoreMock() as any);
  t.assert(repository);
  t.is(repository.collectionPath, '{0}/items/{1}/entities');
  t.is(
    repository.getCollectionPath('tenantId', 'itemId'),
    'tenantId/items/itemId/entities'
  );
});

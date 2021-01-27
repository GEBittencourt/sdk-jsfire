# Software Development Kit - Javascript Firebase

Conjunto de utilitários para aplicações javascript com Firebase.

## Repositório

Para facilitar o desenvolvimento de classes de repositório integradas ao [Cloud Firestore](https://firebase.google.com/docs/firestore), este SDK disponibiliza alguns recursos que auxiliarão na codificação:

### Abstração <em>FirestoreRepository</em>

Uma classe que representará um repositório de uma coleção do banco de dados `Firestore` pode extender da abstração `FirestoreRepository` na qual forçará a implementação de uma propriedade `collectionPath` que terá o nome da coleção, deixará disponível uma propriedade `transaction` que poderá ser definida pela camada de aplicação, afim de, esta camada gerenciar o escopo da transação e também alguns métodos para gravação e leitura na coleção, tais como, `insert`, `update`, `delete` e `findById`.

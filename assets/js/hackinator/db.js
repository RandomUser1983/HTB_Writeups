const DB_NAME = "hackinator";
const DB_VERSION = 2;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;

      // schema changed shape (events indexes, templates keyPath) — rebuild clean
      for (const name of Array.from(db.objectStoreNames)) {
        db.deleteObjectStore(name);
      }

      db.createObjectStore("sessions", { keyPath: "id" });

      const networks = db.createObjectStore("networks", { keyPath: "id" });
      networks.createIndex("bySession", "sessionId");

      const machines = db.createObjectStore("machines", { keyPath: "id" });
      machines.createIndex("byNetwork", "networkId");
      machines.createIndex("bySession", "sessionId");

      const events = db.createObjectStore("events", { keyPath: "seq", autoIncrement: true });
      events.createIndex("bySession", "sessionId");
      events.createIndex("byNetwork", "networkId");
      events.createIndex("byMachine", "machineId");
      events.createIndex("byNetworkSeq", ["networkId", "seq"]);
      events.createIndex("byMachineSeq", ["machineId", "seq"]);

      const assets = db.createObjectStore("assets", { keyPath: "id" });
      assets.createIndex("bySession", "sessionId");
      assets.createIndex("byMachine", "machineId");
      assets.createIndex("byEvent", "eventSeq");

      const templates = db.createObjectStore("templates", { keyPath: ["templateId", "version"] });
      templates.createIndex("byTemplateId", "templateId");

      const creds = db.createObjectStore("creds", { keyPath: "id" });
      creds.createIndex("byNetwork", "networkId");
      creds.createIndex("bySession", "sessionId");
      creds.createIndex("bySourceEvent", "sourceEventSeq");
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function putRecord(storeName, record) {
  return new Promise((resolve, reject) => {
    openDB().then((db) => {
      const tx = db.transaction(storeName, "readwrite");
      const req = tx.objectStore(storeName).put(record);
      tx.oncomplete = () => { db.close(); resolve(req.result); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    }, reject);
  });
}

function saveTemplate(record) { return putRecord("templates", record); }
function saveSession(record) { return putRecord("sessions", record); }
function saveNetwork(record) { return putRecord("networks", record); }
function saveMachine(record) { return putRecord("machines", record); }
function appendEvent(record) { return putRecord("events", record); }
function saveAsset(record) { return putRecord("assets", record); }
function saveCred(record) { return putRecord("creds", record); }

function getAllByIndex(storeName, indexName, key) {
  return new Promise((resolve, reject) => {
    openDB().then((db) => {
      const req = db.transaction(storeName, "readonly").objectStore(storeName).index(indexName).getAll(key);
      req.onsuccess = () => { db.close(); resolve(req.result); };
      req.onerror = () => { db.close(); reject(req.error); };
    }, reject);
  });
}

function getEventsByNetwork(networkId) {
  return getAllByIndex("events", "byNetwork", networkId)
    .then((events) => events.sort((a, b) => a.seq - b.seq));
}

function getEventsByMachine(machineId) {
  return getAllByIndex("events", "byMachine", machineId)
    .then((events) => events.sort((a, b) => a.seq - b.seq));
}

function getTemplate(templateId, version) {
  return new Promise((resolve, reject) => {
    openDB().then((db) => {
      const req = db.transaction("templates", "readonly").objectStore("templates").get([templateId, version]);
      req.onsuccess = () => { db.close(); resolve(req.result); };
      req.onerror = () => { db.close(); reject(req.error); };
    }, reject);
  });
}

function getAllTemplates() {
  return new Promise((resolve, reject) => {
    openDB().then((db) => {
      const req = db.transaction("templates", "readonly").objectStore("templates").getAll();
      req.onsuccess = () => { db.close(); resolve(req.result); };
      req.onerror = () => { db.close(); reject(req.error); };
    }, reject);
  });
}

function deleteDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error("cancellazione bloccata: chiudi altre schede aperte su questa pagina"));
  });
}

export {
  DB_NAME, DB_VERSION, openDB, deleteDB,
  saveTemplate, saveSession, saveNetwork, saveMachine, appendEvent, saveAsset, saveCred,
  getEventsByNetwork, getEventsByMachine, getTemplate, getAllTemplates
};

try {
  rs.initiate({
    _id: "rs0",
    members: [{ _id: 0, host: "mongo:27017" }]
  });
} catch (e) {
  print(e);
}


db = db.getSiblingDB("kafka_auth_service"); // target DB
db.createUser({
  user: "kafka_u1",
  pwd: "test123",
  roles: [{ role: "readWrite", db: "kafka_auth_service" }]
});

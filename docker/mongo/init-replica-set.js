const replicaSetName = process.env.MONGO_REPLICA_SET || 'rs0';

try {
  rs.status();
} catch {
  rs.initiate({
    _id: replicaSetName,
    members: [{ _id: 0, host: 'localhost:27017' }],
  });
}

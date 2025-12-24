import cluster from 'node:cluster';
import os from 'node:os';
import process from 'node:process';

if (cluster.isPrimary) {
  const cpus = os.availableParallelism();
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }
} else {
  await import('./server');
  console.log(`Worker ${process.pid} started`);
}

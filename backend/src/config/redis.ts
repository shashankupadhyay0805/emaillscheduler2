import IORedis from "ioredis";

const redis = new IORedis("redis://localhost:6379");

(async () => {
  await redis.set("test", "ok");
  const value = await redis.get("test");
  console.log(value);
  process.exit(0);
})();

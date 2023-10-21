const { Database,Statement } = require("@tableland/sdk");
const { Wallet, getDefaultProvider, providers, ethers } = require("ethers");
const dotenv = require ("dotenv");
dotenv.config();
const { strictEqual, deepStrictEqual, assert} = require("assert");
const privateKey = process.env.PRIVATE_KEY;
const wallet = new Wallet(privateKey);
const network = "sepolia" //process.env.ETHEREUM_NETWORK;

 // creating a new Provider, and passing in our node URL
//  const node = "https://rpc.sepolia.org";
//  const provider = new ethers.providers.JsonRpcProvider(node);

const infuraProvider = new ethers.providers.InfuraProvider(network, process.env.INFURA_API_KEY);

// const provider = getDefaultProvider("https://sepolia.infura.io/v3/ada60b8f44794dbab932dc1d5dad8110"); 
const signer = wallet.connect(infuraProvider);

// Connect to the database
const db = new Database({ signer });
console.log("db",db)
try
{
    create_table(db);
}catch(err){
    console.error("err in create table",err)
}


async function create_table(db){
const { meta: create } = await db
  .prepare(`CREATE TABLE test (id integer primary key, val text);`)
  .run();

const {name} = await create.txn.wait();
}

async function test(db){
    const sql = "CREATE TABLE test (counter integer);";
    const stmt = db.prepare(sql);

    strictEqual(stmt.toString(), sql);
    deepStrictEqual(stmt, new Statement(db.config, sql));
    console.log("stmt",stmt.toString())

    // const sql_insert = `INSERT INTO test (counter) VALUES (5);`;
    // const { meta } = await db.exec(sql_insert);
    // assert(meta.duration != null);
    // strictEqual(meta.count, 2);
    // assert(meta.txn != null);

    // await meta.txn.wait();

    // const results = await db.prepare("SELECT * FROM " + test).all();
    // strictEqual(results.results.length, 2);
    // console.log("results",results)

 // Create a table
//  const tablePrefix = "starter_table";
//  const createStmt = `CREATE TABLE ${tablePrefix} (id integer primary key, val text)`;
//  const { meta: create } = await db.prepare(createStmt).run();
//  const tableName = create.txn?.name;
//  await create.txn?.wait();

 // Write to the table
//   const writeStmt = `INSERT INTO ${tableName} (id, val) VALUES (1, "asset")`;
//    const { meta } = await db.exec(writeStmt);
//     assert(meta.duration != null);
//     strictEqual(meta.count, 1);
//     assert(meta.txn != null);

//  const { meta: write } = await db.prepare(writeStmt).bind(1, "world").run();
//  await write.txn?.wait();

 // Read from the table
//  const readStmt = `SELECT val FROM ${tableName}`;
//  const { results } = await db.prepare(readStmt).all();
//  return results[0].val;
    

}

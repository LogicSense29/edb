async function simpleAsyncFunction() {
  console.log("Starting simple async function");
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Simple async function completed");
      resolve();
    }, 2000);
  });
}

async function main() {
  console.log("Main function started");
  await simpleAsyncFunction();
  console.log("Main function completed");
}

main().catch((err) => {
  console.error("Error in main function:", err);
});

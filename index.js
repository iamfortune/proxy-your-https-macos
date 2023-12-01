const { exec } = require("child_process");
const { spawn } = require("child_process");
const { createInterface } = require("readline");

const runCommand = (command) => {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.log("Error \n");
				reject(error);
				return;
			}

			if (stderr) {
				console.log(stderr);
			}

			resolve(stdout);
		});
	});
};

const runInteractiveCommand = (command, args) => {
	const spawned = spawn(command, args, { stdio: "inherit" });
	spawned.on("error", (error) => {
		console.error(`Error: ${error}`);
	});
};

const readline = createInterface({
	input: process.stdin,
	output: process.stdout,
});

const askQuestion = (question) => {
	return new Promise((resolve) => {
		readline.question(question, resolve);
	});
};

const runScript = async () => {
	try {
		await runCommand("brew install mkcert");
		await runCommand("mkcert -install");
		await runCommand("mkcert localhost");

		console.log("Installing local-ssl-proxy...");
		await runCommand("npm install -g local-ssl-proxy");
		console.log("Installed local-ssl-proxy ✅", "\n");

		const source = await askQuestion("Enter the source (e.g 3010): ");
		console.log("Source:", source, "\n");

		if (!source) {
			console.log("Source is required");
			readline.close();
			return;
		}

		const target = await askQuestion("Enter the target (e.g 3000): ");
		console.log("Target:", target, "\n");

		if (!target) {
			console.log("Target is required!");
			readline.close();
			return;
		}

		readline.close();

		console.log("Proxying traffic from port", source, "to port", target, "\n");

		runInteractiveCommand("local-ssl-proxy", [
			`--source`,
			source,
			`--target`,
			target,
			"--cert",
			"localhost.pem",
			"--key",
			"localhost-key.pem",
		]);
	} catch (error) {
		console.error("Error:", error);
	}
};

runScript();

# AI Usage Log

## Tool used: ChatGPT

- Date: 11 August 2026 Purpose: Debugging assistance — brew install mysql failed with a warning that macOS 12 is unsupported by Homebrew Outcome: Understood the compatibility issue. Chose to upgrade macOS and continue with Homebrew rather than switch to an alternative installer.

- Date: 11-12 August 2026 Purpose: Debugging assistance — Homebrew build of mysql and its dependencies (including llvm) failed (ninja: build stopped: subcommand failed) after a long compile, with unrelated Command Line Tools warnings appearing throughout Outcome: Understood the warnings were non-fatal but the final build failure was real and expected on an unsupported OS tier. Upgraded macOS and re-ran the install, which then succeeded.

- Date: 12 August 2026 Purpose: Debugging assistance — after installing MySQL, mysql -u root and mysql_secure_installation returned Access denied even with no password set Outcome: Understood, by inspecting ps aux and MySQL's error log directly, that two separate MySQL installations (Homebrew and an earlier official installer) were running simultaneously and conflicting over the same default port and socket file. Diagnosed and applied the fix independently: reinitialised the Homebrew MySQL data directory and reconfigured it to run on port 3307 with its own socket file.

- Date: 12 August 2026 Purpose: Debugging assistance — MySQL Workbench connection showed only the sys schema, not the newly created news_db Outcome: Understood the Workbench connection was pointed at the wrong port. Reconfirmed port 3307 in the connection settings and re-ran the schema script directly in Workbench's SQL editor independently.

- Date: 12 August 2026 Purpose: Debugging assistance — missing .env file, and a separate xcrun: invalid active developer path error that broke git in the terminal Outcome: Understood the .env file simply hadn't been created yet, and created it via terminal independently. For the broken Command Line Tools, used GitHub Desktop as a working alternative to the terminal for commits until the tools could be reinstalled.

- Date: 13 August 2026 Purpose: Explanation of schema-based validation with Zod as a replacement for manual if checks, including why login should not re-validate password complexity Outcome: Understood declarative schema validation and the security reasoning for asymmetric validation between register and login. Wrote middleware/auth-validation.ts and middleware/article-validation.ts independently.

- Date: 13 August 2026 Purpose: Debugging assistance — after adding the new Zod password schema, noticed the old manual check password.length < 6 was still present in the same route Outcome: Understood this was dead, conflicting code left over from before Zod was introduced. Located and removed it independently.

- Date: 13 August 2026 Purpose: Brainstorming - manual test against the assignment's grading criteria — checking each required status code (400/401/403/404) individually and testing a SQL-injection payload against the login endpoint Outcome: Confirmed independently, via curl -i, that every required status code behaved correctly and that the injection attempt was rejected by validation before it could reach the database.

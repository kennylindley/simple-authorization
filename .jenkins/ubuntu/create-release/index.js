/**
 * create-release
 *
 * Uses the GitHub Octokit package to create and update GitHub releases
 *
 * Environment variables:
 * GH_TOKEN - The Simply Made Apps GitHub token
 * OWNER - The owner of the repo: i.e. simplymadeapps
 * REPO - The name of the repo: i.e. simpleinout-js-segment-control
 */

/* eslint-disable camelcase */
const { Octokit } = require("@octokit/core");
const owner = process.env.OWNER;
const repo = process.env.REPO;

const octokit = new Octokit({
  auth: process.env.GH_TOKEN
});

/**
 * Finds the version of this package
 *
 * @returns {string} The version number of this package with a prepended "v"
 */
function getLocalVersion() {
  const { version } = require("../../../package.json");

  return `v${version}`;
}

/**
 * Finds a release for this package's version
 *
 * @returns {object} The data and a boolean describing if anything was found
 */
async function getReleaseForTag() {
  const tag = getLocalVersion();

  const releases = await octokit.request("GET /repos/{owner}/{repo}/releases", {
    owner,
    repo
  });

  const release = releases.data.find(element => element.tag_name === tag);

  if (!release) {
    return { data: {}, found: false };
  }

  return { data: release, found: true };
}

/**
 * Creates a release in GitHub releases
 */
async function createRelease() {
  const tag_name = getLocalVersion();

  await octokit.request("POST /repos/{owner}/{repo}/releases", {
    draft: true,
    generate_release_notes: true,
    name: tag_name,
    owner,
    prerelease: false,
    repo,
    tag_name,
    target_commitish: "main"
  });
}

/**
 * Updates the release notes for a release that has alread been drafted
 *
 * @param {number} release_id The unique ID for this release
 */
async function updateRelease(release_id) {
  const tag_name = getLocalVersion();

  const releaseNotes = await octokit.request("POST /repos/{owner}/{repo}/releases/generate-notes", {
    owner,
    repo,
    tag_name
  });

  await octokit.request("PATCH /repos/{owner}/{repo}/releases/{release_id}", {
    body: releaseNotes.data.body,
    owner,
    release_id,
    repo,
    tag_name
  });
}

/**
 * The main function for the create-release command
 */
async function main() {
  const { found, data } = await getReleaseForTag();

  if (!found) {
    createRelease();

    console.log("No release exists for this version, creating a new one.");

    return;
  }

  if (data.draft) {
    updateRelease(data.id);

    console.log("Updating an unpublished release for this version.");

    return;
  }

  console.log("A published release already exists for this version.");
}

main();

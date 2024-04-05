const config = {
    branches: ['main'],
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      ["@semantic-release/git", {
        "assets": ["dist/*.yml","dist/*.yaml", "dist/*.zip","dist/*.zip.blockmap"],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }],
      '@semantic-release/github'
    ]
  };
  module.exports = config;
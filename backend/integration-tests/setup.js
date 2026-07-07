const { MetadataStorage } = require("@mikro-orm/core")

afterEach(() => {
  MetadataStorage.clear()
})

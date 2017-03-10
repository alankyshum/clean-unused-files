# NodeJS Script to remove unreferenced files
![Imgur](http://i.imgur.com/YG2SvTO.png)

## Dependencies
1. Requires `ag` ([The Silver Searcher](https://github.com/ggreer/the_silver_searcher)) installed
1. `ag` avaialble in `$PATH` environment variable
1. Node.JS

## Before you go
1. `yarn install` (faster) or `npm install`
1. Create and edit `config.json` (from `config.example.json`), to change the following lines
```javascript
searchFolder: FOLDER_TO_SEARCH_FOR_REFERENCE,
imgFolder: FOLDER_THAT_CONTAINS_IMAGES_TO_BE_REMOVED
```
  - The script won't work until those configs are updated

## Run the script
1. It will show all files usages (powered by `ag`)
    - showing the files that have reference to those files
1. Show `used files` and `unused files`, and the paths
1. Move to the extract folder
    - update the `config.outputFolder` to change the output folder
    - default to `./extract`

## Todo
1. [ ] Make this a `gulp` pipeline module, and able to be integrated into maintenance workflow
1. [ ] Options to silient stdout
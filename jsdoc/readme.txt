To update documentation on GitHub Project Site:
1. Run the 'docs' task which builds runs jsdoc and outputs to /dist/docs
2. Copy /dist/docs to the spscript gh-pages branch which is a separate folder  ../spscript-site
>>npm run docs
>>copy -recurse -force ./dist/docs ../spscript-site
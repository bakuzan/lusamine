# Lusamine Tools

A command line tool to help download data for building the necessary data files for the application.

## How to use

### Data

`npm run scrape:data`

This will scrape pokemon data and create files in the tools/output folder.

### Images

`npm run scrape:image`

This will download images to the tools/images/\* folders.

### Regions

`npm run scrape:region`

This will scrape region information and create files in the tools/output folder.

**Note:** Regions can only be pulled if they have had their URL added to the tools/regionalPokedex dictionary.

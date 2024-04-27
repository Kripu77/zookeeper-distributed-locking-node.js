#!/bin/bash

# MongoDB connection details
read -p "Enter MongoDB URI: " URI
read -p "Enter the number to start from: Example 1: " START
read -p "Enter the number of docs to insert: " COUNT
DATABASE="sample_db"
COLLECTION="sample_collection"

# Path to JSON data file
cd ..
TEMPLATE_JSON="$PWD/data/sample.json"

# Loop to create and insert n number of documents
for ((i=$START; i<=$COUNT; i++)); do

    recordId= "record-r1-${i}"
    ID_ONE=$(uuidgen)

    # Replaces placeholders in the template JSON with unique values
    JSON_DATA=$(sed -e "s/record/$CBID_CHARGER_ONE/g"   "$TEMPLATE_JSON")

    # Connect to MongoDB instance and insert the document
    echo "$JSON_DATA" | /usr/local/bin/mongodb-database-tools-macos-arm64-100.9.4/bin/mongoimport --uri "$URI" --authenticationDatabase "admin" --db "$DATABASE" --collection "$COLLECTION" --jsonArray
done
const express = require('express');
const { Client } = require('elasticsearch');
const json = require('body-parser');

const client = new Client({
    node: process.env.ELASTIC_CLUSTER_TEST
});

exports.getInfo = async (req, res, next) => {
    client.cluster.health({}, function (err, resp, status) {
        if (resp) {
            console.log("Cluster health: ", resp);
            res.status(status).json(resp);
        }
        console.log(err);
        return next(resp);
    });
}

exports.addIndex = async (req, res, next) => {
    const {indexName, owner, keywords} = req.body;

    client.indices.create(
        {
            index: indexName,
        },
        function (err, resp, status) {
            if (err) {
                console.log(err);
                res.status(400).json({ err });
            }
            else {
                console.log("Created ", resp);
            }
        }
    );

    try {
        client.index(
            {
                index: indexName,
                body: {
                    owner: owner,
                    keywords: keywords
                }
            },
            function (err, resp, status) {
                if (err) {
                    console.log(resp);
                    res.status(status).json({ err });
                }
                else {
                    res.status(status).json({ message: "Created index", resp});
                }
            }
        );
    } catch (err) {
        return next(err);
    }
}

exports.deleteIndex = async (req, res, next) => {
    const { indexName } = req.body;

    client.indices.delete(
        {
            index: indexName,
        },
        function (err, resp, status) {
            if (err) {
                console.log(err);
                res.status(404).json({ err });
            } else {
                console.log("Deleted", resp);
                res.status(200).json({ message: "Deleted index ", resp});
            }
        }
    );
}

exports.searchIndex = async (req, res, next) => {
    const { indexName, owner } = req.body;

    try {
        const result = await client.search({
            index: indexName,
            owner: owner
        });

        if (!result) {
            res.status(404).json({ message: "Could not find anything" }); // bad 
        }

        res.status(200).json({ message: "Successfull query", result});
    } catch (err) {
        return next(err);
    }
}
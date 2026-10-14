package com.anuragjoshi.portfolio.service;

/** Thrown when content the site needs (such as the profile) hasn't been added to the database. */
public class ContentNotFoundException extends RuntimeException {

    public ContentNotFoundException(String message) {
        super(message);
    }
}

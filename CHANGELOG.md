# Restgoose (generator-restgoose) Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [ 28th December 2018 ] v0.5.0

This is Major Feature Release

- Features
  - Complete re-write of architecture from scratch
  - SDKs are up to date
  - yo v2 complied
  - All generated code is promisified
  - Auto Referencing of Models
  - Auto Population
  - Fully Advanced Search (POST)
  - Upgraded Email System
  - Fully npm Audited Generated Code
  - Fully npm Audited fascilitator code
  - Fewer, Better and Cleaner code generation
  - Searching and Updating models are configurable in the schema itself.
  - many more... (Yes, I will do a full tutorial in moments to come)
- Bug Fixes
  - (Put) was removing unspecified body data
  - Linting Errors
  - Web Url

## [ 13th November 2018 ] v0.4.0

This is Refactoring upgrade

- Features
  - Minimized Code footprint
  - Upgraded Packages
  - Simpler HRBAC Authorization
  - Advanced Search using POST
  - Refactored all apiObject code
  - Added 2 new properties to mongoose models (mutable: editable using PUT, searchable: searchable using GET/POST)

## [ 26th September 2018 ] v0.3.6

This is feature upgrade

- Features
  - Unity SDK
  - Angular SDK
  - Git Initialization
- Bug Fixes
  - deleteAll was not working properly
  - couldnt find server ip variable

## [ 8th September 2018 ] v0.3.5

This is package upgrade, Performance and code minimzation release

- Upgraded all Package Versions
- Removed grunt for simpler usage
- removed all vulnerable packages and checked using npm audit
- Fixed some stuff in test cases
- Minimized & simplified code for more readability, maintenance and performance
- Refactored code here and there
- One new test added
- Pushed logs to /logs directory
- Removed bower traces

## [ 23rd April 2018 ] v0.3.1

This is mainly a bug fix release

- Bug Fixes
  - Search Api changed to /<model>s/search
  - Search apiObject was not working correctly
  - Linted All Files
  - Fixed some stuff in test cases
  - added debug for all generated files

## [ 20th March 2018 ] v0.3.0

- Breaking Changes \* New Configuration File and Email System has made it in-compatible with previous versions of restgoose. However, Schema Generation and deletion is unaffected.
- Optimizations & Upgrades
  _ eslilnt support
  _ Upgraded Mongoose Connection system
  _ added Helmet
  _ Complete revamped and runtime configurable email system.
  _ Completely Scalable Configuration System ( Check Config ... )
  _ Moved Helper Functions to `require('./config').util`
  _ Updated email-templates working to work with latest version ( no more legacy dependency hack)
  _ Add 'use strict' to all generated files
  _ Updated Docs
  _ Removed .localrc dependency
  _ Updated Packages
  _ Linted All Generated and Source Codes
  _ Made More readable generated code with eslint recommendations
  _ Updated Test Docs \* Added Mailgun Support - ()[https://github.com/EranGoldman]()[https://github.com/vikz91/generator-restgoose/commit/bebd200382ef886f99afa42be023ade2c980da06]
- Bug Fixes
  _ Package Version Mismatches
  _ email-templates wiring system

## [ 14th Sep 2017 ] v0.2.51

- Bug Fixes
  _ Fixed Small Leftover [footprint](https://github.com/vikz91/generator-restgoose/issues/8)
  _ Fixed EmailTemplate Version Mismatch

## [ 14th Sep 2017 ] v0.2.5

- Optimizations & Upgrades
  _ Updated Docs
  _ Email Templates
  _ NodeMailer Support
  _ JSON Server Configuration (server\*config.json)
  - Easy Development and production switch (.localrc)
    \_ Updated Packages
- Bug Fixes
  _ CB for get route
  _ Fixed JWT Auth Extractor

## [ 26th May 2017 ] v0.2.2

- Optimizations & Upgrades \* Updated Docs
- Bug Fixes
  _ Roles for registration
  _ Profile name

## [ 29th March 2017 ] v0.2.0

- Migration
  Since response callbacks are changed, this version is not backwards compatible. However, I am locking down core transport methods ( response calbacks, etc.) so as to make future versions backward compatible.
- Features
  _ **Passport + JWT + Redis based out-of-the-box Authentication**
  _ Authorization Middleware \* Core Response Lockdown. Future versions will be backwards compatible.
- Optimizations & Upgrades
  _ Updated Docs
  _ Changed Response Method to very simple err first callbacks \* Removed complex response classes
- Bug Fixes \* minor memory optimizations

## [ 22 Mar 2017 ] v0.1.9

- Bug Fixes \* fixed apiObject update (put) method
- Issues
  _ #6 [Typo for Endpoint Summary for Search](https://github.com/vikz91/generator-restgoose/issues/6)
  _ #5 [Mixed datatype](https://github.com/vikz91/generator-restgoose/issues/5)

## [ 28 Jan 2017 ] v0.1.8

- Features \* Universal Search Functionality ( both Strict and Casual Options)
- Optimizations & Upgrades \* Updated Docs
- Bug Fixes \* fixed test mothod in api

## [ 8 Jan 2017 ] v0.1.6

- Migration  
  With as much pain I can endure, this version of generator-restgoose is **not** backwards-compatible. This comes due to changing the core response object of all API endpoints. I will write up a blog page/[wiki](https://github.com/vikz91/generator-restgoose/wiki/Migrations) very soon for reasons, resolutions and troubleshooting. I personally regret inconveniences caused.  
  Despite this, If you need more reasons to keep using this project, read on ...
- Features
  _ Unified JSON response object \([jSend](https://labs.omniti.com/labs/jsend)\)
  _ Quick Auto Callback and Response Handlers ( check `config/lib.js`)
  _ Sub-Generator generates document for your schema
  _ Wiki & FAQs
  _ generated project README
  _ New Sub-Generator for deleting a schema, and its files.
- Optimizations & Upgrades
  _ generator-restgoose README (this one)
  _ Dedicated github-page and website
  _ Changed all broken links
  _ Updated All Dependencies
  _ Better & Clean Code Generation
  _ Better Test Cases

## [ 5 Feb 2016 ] v0.1.5

- Bug Fixed for Test Route in APIs

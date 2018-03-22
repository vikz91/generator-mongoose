# ${project-name} Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [ 20th March 2018 ] v0.3.0
* Breaking Changes
	* New Configuration File and Email System has made it in-compatible with previous versions of restgoose. However, Schema Generation and deletion is unaffected. 
* Optimizations & Upgrades
	* eslilnt support
	* Upgraded Mongoose Connection system
	* added Helmet
	* Complete revamped and runtime configurable email system. 
	* Completely Scalable Configuration System ( Check Config ... )
	* Moved Helper Functions to ``require('./config').util``
	* Updated email-templates working to work with latest version ( no more legacy dependency hack)
	* Add 'use strict' to all generated files
	* Updated Docs
	* Removed .localrc dependency
	* Updated Packages
	* Linted All Generated and Source Codes
	* Made More readable generated code with eslint recommendations
	* Updated Test Docs
	* Added Mailgun Support - ()[https://github.com/EranGoldman] ()[https://github.com/vikz91/generator-restgoose/commit/bebd200382ef886f99afa42be023ade2c980da06]
* Bug Fixes
	* Package Version Mismatches
	* email-templates wiring system



## [ 14th Sep 2017 ] v0.2.51
* Bug Fixes
	* Fixed Small Leftover [footprint](https://github.com/vikz91/generator-restgoose/issues/8)
	* Fixed EmailTemplate Version Mismatch

## [ 14th Sep 2017 ] v0.2.5
* Optimizations & Upgrades
	* Updated Docs
	* Email Templates
	* NodeMailer Support
	* JSON Server Configuration (server_config.json)
	* Easy Development and production switch (.localrc)
	* Updated Packages
* Bug Fixes
	* CB for get route
	* Fixed JWT Auth Extractor



## [ 26th May 2017 ] v0.2.2
* Optimizations & Upgrades
	* Updated Docs
* Bug Fixes
	* Roles for registration
	* Profile name 



## [ 29th March 2017 ] v0.2.0
* Migration 
Since response callbacks are changed, this version is not backwards compatible. However, I am locking down core transport methods ( response calbacks, etc.) so as to make future versions backward compatible. 
* Features
	* **Passport + JWT + Redis based out-of-the-box Authentication**
	* Authorization Middleware
	* Core Response Lockdown. Future versions will be backwards compatible.
* Optimizations & Upgrades
	* Updated Docs
	* Changed Response Method to very simple err first callbacks
	* Removed complex response classes
* Bug Fixes
	* minor memory optimizations


## [ 22 Mar 2017 ] v0.1.9
* Bug Fixes
	* fixed apiObject update (put) method
* Issues
	* #6 [Typo for Endpoint Summary for Search]( https://github.com/vikz91/generator-restgoose/issues/6 )
	* #5 [Mixed datatype](https://github.com/vikz91/generator-restgoose/issues/5)



## [ 28 Jan 2017 ] v0.1.8
* Features
	* Universal Search Functionality ( both Strict and Casual Options)
* Optimizations & Upgrades
	* Updated Docs
* Bug Fixes
	* fixed test mothod in api




## [ 8 Jan 2017 ] v0.1.6

* Migration   
With as much pain I can endure, this version of generator-restgoose is **not** backwards-compatible. This comes due to changing the core response object of all API endpoints. I will write up a blog page/[wiki](https://github.com/vikz91/generator-restgoose/wiki/Migrations) very soon for reasons, resolutions and troubleshooting. I personally regret inconveniences caused.  
Despite this, If you need more reasons to keep using this project, read on ...
* Features
	* Unified JSON response object \([jSend](https://labs.omniti.com/labs/jsend)\)
	* Quick Auto Callback and Response Handlers ( check `config/lib.js`)
	* Sub-Generator generates document for your schema
	* Wiki & FAQs
	* generated project README 
	* New Sub-Generator for deleting a schema, and its files.
* Optimizations & Upgrades
	* generator-restgoose README (this one)
	* Dedicated github-page and website
	* Changed all broken links
	* Updated All Dependencies
	* Better & Clean Code Generation
	* Better Test Cases


## [ 5 Feb 2016 ] v0.1.5
- Bug Fixed for Test Route in APIs
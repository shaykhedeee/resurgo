Book APIs
Open Library has several APIs for accessing Book data.

The Search API (preferred, multi)
The Works API (by Work ID)
The Editions API (by Edition ID)
The ISBN API (by ISBN)
The Books API (generic)
The Book Search API
If you are looking for a single API to meet all of your book needs, it's likely the Book Search API.

Learnings about Works v Editions
When we refer to books on Open Library, we're often referring to a specific work and possibly a specific edition of this work.

A Work is a logical collection of similar Editions. "Fantastic Mr. Fox" could be a Work which contains a Spanish translation edition, or perhaps a 2nd edition which has an additional chapter or corrections. Work metadata will include general umbrella information about a book, whereas an Edition will have a publisher, an ISBN, a book-jacket, and other specific information.

Both Work and Edition pages on Open Library (i.e. the pages you navigate to) may also be returned as json or yml (in addition to HTML) by modifying the page URL.

Learn more about the fields that belong to works and editions.

Works API
Work pages on Open Library begin with the URL prefix "/works".

Here is an example:
https://openlibrary.org/works/OL45804W/Fantastic_Mr._FOX

In this example, if we remove the /Title from the URL (e.g. https://openlibrary.org/works/OL45804W) and then add a suffix of ".json" or ".yml" to the end, the page will return a data representation instead of HTML, e.g.:

https://openlibrary.org/works/OL45804W.json

Fetching a Work's Editions
You can fetch a work's editions by adding /editions.json after the work ID:

https://openlibrary.org/works/OL45804W/editions.json

Ratings and Bookshelves
Can be accessed by the following APIs:
https://openlibrary.org/works/OL18020194W/bookshelves.json
https://openlibrary.org/works/OL18020194W/ratings.json

Editions API
Edition pages on Open Library begin with the prefix "/books".

Here is an example:
https://openlibrary.org/books/OL7353617M/Fantastic_Mr._Fox

In this example, if we remove the /Title from the URL (e.g. https://openlibrary.org/works/OL45804W) and then add a suffix of ".json" or ".yml" to the end, the page will return a data representation instead of HTML, e.g.:

https://openlibrary.org/books/OL7353617M.json

ISBN API
The ISBN API is a special case and alternative approach to arriving at an Editions page. Instead of "/books", a path of "/isbn" is used, followed by a valid ISBN 10 or 13.

Here is an example:
https://openlibrary.org/isbn/9780140328721

In this example, entering this URL will result in a redirect to the appropriate Editions page: https://openlibrary.org/books/OL7353617M

Just like an Edition or Work page, we may add ".json" to the end of the URL to request the response in json instead of as HTML, e.g.:

https://openlibrary.org/isbn/9780140328721.json

Legacy Book API
Please consider using the Book Search API above; this is a legacy endpoint and may be phased out in the future.

The Book API is a generic, flexible, configurable endpoint which allows requesting information on one or more books using ISBNs, OCLC Numbers, LCCNs and OLIDs (Open Library IDs). It is inspired by the Google Books Dynamic links API and is compatible with it.

At the core of the API is a URL format that allows developers to construct URLs requesting information on one or more books and send the requests to the Open Library using the <script> tag.

<script src="https://openlibrary.org/api/books?bibkeys=ISBN:0451526538&callback=mycallback"></script>
Request Format
The API supports the following query parameters.

bibkeys

List of IDs to request the information. The API supports ISBNs, LCCNs, OCLC numbers and OLIDs (Open Library IDs).

ISBN

Ex. &bibkeys=ISBN:0451526538 (The API supports both ISBN 10 and 13.)
OCLC

&bibkeys=OCLC:#########
LCCN

&bibkeys=LCCN:#########
OLID

&bibkeys=OLID:OL123M
format

Optional parameter which specifies the response format. Possible values are json and javascript. The default format is javascript.

callback

Optional parameter which specifies the name of the JavaScript function to call with the result. This is considered only when the format is javascript.

jscmd

Optional parameter to decide what information to provide for each matched bib_key. Possible values are viewapi and data. The default value is viewapi.

The Response Format
The response of the API contains a JSON object for each matched bib_key. The contents of the JSON object are decided by the jscmd parameter.

By default, the API returns the response as Javascript.

$ curl 'http://openlibrary.org/api/books?bibkeys=ISBN:0201558025,LCCN:93005405'
var _OLBookInfo = {
    "ISBN:0201558025": {
        ...
    },
    "LCCN:93005405": {
        ...
    }
};
When optional callback parameter is passed, the response is wrapped in a Javascript function call.

$ curl 'https://openlibrary.org/api/books?bibkeys=ISBN:0201558025,LCCN:93005405&callback=processBooks'
processBooks({
    "ISBN:0201558025": {
        ...
    },
    "LCCN:93005405": {
        ...
    }
});
When format=json parameter is passed, the API returns the response as JSON instead of Javascript. This is useful when accessing the API at the server-side.

$ curl 'https://openlibrary.org/api/books?bibkeys=ISBN:0201558025,LCCN:93005405&format=json'
{
    "ISBN:0201558025": {
        ...
    },
    "LCCN:93005405": {
        ...
    }
}
The Data Format
The contents of each JSON object will be decided by the jscmd parameter.

jscmd=viewapi
When jscmd is not specified or when jscmd=viewapi, each JSON object will contain the following:

bib_key

Identifier used to query this book.

info_url

A URL to the book page in the Open Library.

preview

Preview state - either "noview" or "full".

preview_url

A URL to the preview of the book.

This links to the archive.org page when a readable version of the book is available, otherwise it links to the book page on openlibrary.org.

Please note that the preview_url is always provided even if there is no readable version available. The preview property should be used to test if a book is readable.

thumbnail_url

A URL to a thumbnail of the cover of the book. This is provided only when thumbnail is available.

For example:

$ curl 'https://openlibrary.org/api/books?bibkeys=ISBN:0385472579,LCCN:62019420&format=json'
{
    "ISBN:0385472579": {
        "bib_key": "ISBN:0385472579",
        "preview": "noview",
        "thumbnail_url": "https://covers.openlibrary.org/b/id/240726-S.jpg",
        "preview_url": "https://openlibrary.org/books/OL1397864M/Zen_speaks",
        "info_url": "https://openlibrary.org/books/OL1397864M/Zen_speaks"
    },
    "LCCN:62019420": {
        "bib_key": "LCCN:62019420",
        "preview": "full",
        "thumbnail_url": "https://covers.openlibrary.org/b/id/6121771-S.jpg",
        "preview_url": "https://archive.org/details/adventurestomsa00twaigoog",
        "info_url": "https://openlibrary.org/books/OL23377687M/adventures_of_Tom_Sawyer"
    }
}
jscmd=data
When the jscmd=data, data about each matching book is returned. It includes the following:

url

URL of the book

title and subtitle

Title and subtitle of the book.

authors

List of authors. Each entry will be in the following format:

{
    "name": "...",
    "url": "https://openlibrary.org/authors/..."
}
identifiers

All identifiers of the book in the following format:

{
    "isbn_10": [...],
    "isbn_13": [...],
    "lccn": [...],
    "oclc": [...],
    "goodreads": [...]
}
classifications

All classifications of the book in the following format.

{
    "lc_classifications": [...],
    "dewey_decimal_class": [...]
}
subjects, subject_places, subject_people and subject_times

List of subjects, places, people and times of the book. Each entry will be in the following format:

{
    "url": "https://openlibrary.org/subjects/history",
    "name": "History"
}
publishers

List of publishers. Each publisher will be in the following format:

{
    "name": "..."
}
publish_places

List of publish places. Each entry will be in the following format:

{
    "name": "..."
}
publish_date

Published date as a string.

excerpts

List of excerpts to that book. Each entry will be in the following format:

{
    "comment": "...",
    "text": "..."
}
links

List of links to the book. Each link will be in the following format:

{
    "url": "https://...",
    "title": "..."
}
cover

URLs to small, medium and large covers.

{
    "small": "https://covers.openlibrary.org/b/id/1-S.jpg",
    "medium": "https://covers.openlibrary.org/b/id/1-M.jpg",
    "large": "https://covers.openlibrary.org/b/id/1-L.jpg",
}
ebooks

List of ebooks. Each entry will be in the following format:

{
    "preview_url": "https://archive.org/details/..."
}
number_of_pages

Number of pages in that book.

weight

Weight of the book.

For example, here is a sample request.

$ curl 'https://openlibrary.org/api/books?bibkeys=ISBN:9780980200447&jscmd=data&format=json'
{
    "ISBN:9780980200447": {
        "publishers": [
            {
                "name": "Litwin Books"
            }
        ],
        "identifiers": {
            "google": [
                "4LQU1YwhY6kC"
            ],
            "lccn": [
                "2008054742"
            ],
            "isbn_13": [
                "9780980200447"
            ],
            "amazon": [
                "098020044X"
            ],
            "isbn_10": [
                "1234567890"
            ],
            "oclc": [
                "297222669"
            ],
            "librarything": [
                "8071257"
            ],
            "project_gutenberg": [
                "14916"
            ],
            "goodreads": [
                "6383507"
            ]
        },
        "classifications": {
            "dewey_decimal_class": [
                "028/.9"
            ],
            "lc_classifications": [
                "Z1003 .M58 2009"
            ]
        },
        "links": [
            {
                "url": "http://johnmiedema.ca",
                "title": "Author's Website"
            }
        ],
        "weight": "1 grams",
        "title": "Slow reading",
        "url": "https://openlibrary.org/books/OL22853304M/Slow_reading",
        "number_of_pages": 80,
        "cover": {
            "small": "https://covers.openlibrary.org/b/id/5546156-S.jpg",
            "large": "https://covers.openlibrary.org/b/id/5546156-L.jpg",
            "medium": "https://covers.openlibrary.org/b/id/5546156-M.jpg"
        },
        "subjects": [
            {
                "url": "https://openlibrary.org/subjects/books_and_reading",
                "name": "Books and reading"
            },
            {
                "url": "https://openlibrary.org/subjects/reading",
                "name": "Reading"
            }
        ],
        "publish_date": "2009",
        "authors": [
            {
                "url": "https://openlibrary.org/authors/OL6548935A/John_Miedema",
                "name": "John Miedema"
            }
        ],
        "excerpts": [
            {
                "comment": "test purposes",
                "text": "test first page"
            }
        ],
        "publish_places": [
            {
                "name": "Duluth, Minn"
            }
        ]
    }
}
jscmd=details
When jscmd=details is passed, additional details are provided in addition to the info provided by viewapi. The provided details are same as the data provided by the RESTful API.

It is advised to use jscmd=data instead of this as that is more stable format.

$ curl 'https://openlibrary.org/api/books?bibkeys=ISBN:9780980200447&jscmd=details&format=json'
{
    "ISBN:9780980200447": {
        "info_url": "https://openlibrary.org/books/OL22853304M/Slow_reading",
        "bib_key": "ISBN:9780980200447",
        "preview_url": "https://openlibrary.org/books/OL22853304M/Slow_reading",
        "thumbnail_url": "https://covers.openlibrary.org/b/id/5546156-S.jpg",
        "preview": "noview",
        "details": {
            "number_of_pages": 80,
            "table_of_contents": [
                {
                    "title": "The personal nature of slow reading",
                    "type": {
                        "key": "/type/toc_item"
                    },
                    "level": 0
                },
                {
                    "title": "Slow reading in an information ecology",
                    "type": {
                        "key": "/type/toc_item"
                    },
                    "level": 0
                },
                {
                    "title": "The slow movement and slow reading",
                    "type": {
                        "key": "/type/toc_item"
                    },
                    "level": 0
                },
                {
                    "title": "The psychology of slow reading",
                    "type": {
                        "key": "/type/toc_item"
                    },
                    "level": 0
                },
                {
                    "title": "The practice of slow reading.",
                    "type": {
                        "key": "/type/toc_item"
                    },
                    "level": 0
                }
            ],
            "weight": "1 grams",
            "covers": [
                5546156
            ],
            "lc_classifications": [
                "Z1003 .M58 2009"
            ],
            "latest_revision": 14,
            "source_records": [
                "marc:marc_loc_updates/v37.i01.records.utf8:4714764:907",
                "marc:marc_loc_updates/v37.i24.records.utf8:7913973:914",
                "marc:marc_loc_updates/v37.i30.records.utf8:11406606:914"
            ],
            "title": "Slow reading",
            "languages": [
                {
                    "key": "/languages/eng"
                }
            ],
            "subjects": [
                "Books and reading",
                "Reading"
            ],
            "publish_country": "mnu",
            "by_statement": "by John Miedema.",
            "oclc_numbers": [
                "297222669"
            ],
            "type": {
                "key": "/type/edition"
            },
            "physical_dimensions": "1 x 1 x 1 inches",
            "revision": 14,
            "publishers": [
                "Litwin Books"
            ],
            "description": "\"A study of voluntary slow reading from diverse angles\"--Provided by publisher.",
            "physical_format": "Paperback",
            "last_modified": {
                "type": "/type/datetime",
                "value": "2010-08-07T19:35:52.482887"
            },
            "key": "/books/OL22853304M",
            "authors": [
                {
                    "name": "John Miedema",
                    "key": "/authors/OL6548935A"
                }
            ],
            "publish_places": [
                "Duluth, Minn"
            ],
            "pagination": "80p.",
            "classifications": {},
            "created": {
                "type": "/type/datetime",
                "value": "2009-01-07T22:16:11.381678"
            },
            "lccn": [
                "2008054742"
            ],
            "notes": "Includes bibliographical references and index.",
            "identifiers": {
                "amazon": [
                    "098020044X"
                ],
                "google": [
                    "4LQU1YwhY6kC"
                ],
                "project_gutenberg": [
                    "14916"
                ],
                "goodreads": [
                    "6383507"
                ],
                "librarything": [
                    "8071257"
                ]
            },
            "isbn_13": [
                "9780980200447"
            ],
            "dewey_decimal_class": [
                "028/.9"
            ],
            "isbn_10": [
                "1234567890"
            ],
            "publish_date": "2009",
            "works": [
                {
                    "key": "/works/OL13694821W"
                }
            ]
        }
    }
}
Earlier these details were provided when details=true parameter is passed. It is equivalent to jscmd=details and it is retained only for backward-compataibilty.

URL: https://openlibrary.org/search.json

Parameter	Description
q	The solr query. See Search HowTo for sample queries
fields	The fields to get back from solr. The special value * may be provided to fetch all fields (however this will result in an expensive response, please use sparingly).
To fetch availability data from archive.org, add the special value, availability. Example: /search.json?q=harry%20potter&fields=*,availability&limit=1. This will fetch the availability data of the first item in the `ia` field.
sort	You can sort the results by various facets such as new, old, random, or key (which sorts as a string, not as the number stored in the string). For a complete list of sorts facets look here (this link goes to a specific commit, be sure to look at the latest one for changes). The default is to sort by relevance.
lang	The users language as a two letter (ISO 639-1) language code. This influences but doesn't exclude search results. For example setting this to fr will prefer/display the French edition of a given work, but will still match works that don't have French editions. Adding language:fre on the other hand to the search query will exclude results that don't have a French edition.
offset / limit	Use for pagination.
page / limit	Use for pagination, with limit corresponding to the page size. Note page starts at 1.
Overview
The Open Library Search API is one of the most convenient and complete ways to retrieve book data on Open Library. The API:

Is able to return data for multiple books in a single request/response
Returns both Work level information about the book (like author info, first publish year, etc), as well as Edition level information (like title, identifiers, covers, etc)
Author IDs are returned which you can use to fetch the author's image, if available
Options are available to return Book Availability along with the response.
Powerful sorting options are available, such as star ratings, publication date, and number of editions.
Examples
The URL format for API is simple. Take the search URL and add .json to the end. Eg:

https://openlibrary.org/search.json?q=the+lord+of+the+rings
https://openlibrary.org/search.json?title=the+lord+of+the+rings
https://openlibrary.org/search.json?author=tolkien&sort=new
https://openlibrary.org/search.json?q=the+lord+of+the+rings&page=2
https://openlibrary.org/search/authors.json?q=twain
Using Thing IDs to get Images
You can use the olid (Open Library ID) for authors and books to fetch covers by olid, e.g.:
https://covers.openlibrary.org/a/olid/OL23919A-M.jpg

Response Format
The response with be of the following format.

{
    "start": 0,
    "num_found": 629,
    "docs": [
        {...},
        {...},
        ...
        {...}]
}
Each document specified listed in "docs" will be of the following format:

{
    "cover_i": 258027,
    "has_fulltext": true,
    "edition_count": 120,
    "title": "The Lord of the Rings",
    "author_name": [
        "J. R. R. Tolkien"
    ],
    "first_publish_year": 1954,
    "key": "OL27448W",
    "ia": [
        "returnofking00tolk_1",
        "lordofrings00tolk_1",
        "lordofrings00tolk_0",
    ],
    "author_key": [
        "OL26320A"
    ],
    "public_scan_b": true
}
The fields in the doc are described by Solr schema which can be found here:
https://github.com/internetarchive/openlibrary/blob/b4afa14b0981ae1785c26c71908af99b879fa975/openlibrary/plugins/worksearch/schemes/works.py#L38-L91

The schema is not guaranteed to be stable, but most common fields (e.g. title, IA ids, etc) should be safe to depend on.

Getting edition information
By default, the search endpoint returns works instead of editions. A work is a collection of editions; for example there is only one work for The Wonderful Wizard of Oz (OL18417W), but there are 1029 editions, over many languages! Sometimes you might want to fetch data about editions as well as works. That is what the editions field is for:

https://openlibrary.org/search.json?q=crime+and+punishment&fields=key,title,author_name,editions

{
    "numFound": 2421,
    "start": 0,
    "numFoundExact": true,
    "docs": [
        {
            "key": "/works/OL166894W",
            "title": "Преступление и наказание",
            "author_name": ["Фёдор Михайлович Достоевский"],
            "editions": {
                "numFound": 290,
                "start": 0,
                "numFoundExact": true,
                "docs": [
                    {
                        "key": "/books/OL37239326M",
                        "title": "Crime and Punishment"
                    }
                ]
            }
        },
    ...
The editions sub-object contains the editions of this work that match the user's query (here, "crime and punishment"), sorted so the best (i.e. most relevant) is at the top. Matching editions are first selected by forwarding any search fields in the query that apply to editions (e.g. publisher, language, ebook_access, has_fulltext, etc). Any un-fielded search terms (e.g. "crime and punishment", above) are also applied, but are not require to all match.

From these, relevance is further determined by boosting books that (1) match the user's language, (2) are readable, (3) have a cover.

You can see this in action in the search UI as well. Consider the following searches:

"sherlock holmes" - The first work is OL262463W, with the edition displayed Memoirs of Sherlock Holmes (OL7058607M). This edition was selected because it matched the user's query, and it matched the user's language (my language is English), and because it was readable.
"sherlock holmes language:fre" - The same work is displayed as above, but now the displayed edition is Souvenirs sur Sherlock Holmes (OL8887270M), selected because the user's query requires a book in French.
"sherlock holmes" for a French user - By setting lang=fr in the URL, we can simulate the website as it would appear for a French user. This information is used to influence the results again, and the displayed edition is Souvenirs sur Sherlock Holmes (OL8887270M) since this matches the user's language.
"souvenirs sur sherlock holmes" - Here as an English user, I search by the French title. So again I will see the same work as always, but the displayed edition will now also be Souvenirs sur Sherlock Holmes (OL8887270M) since this best matches the user's query.
In the API, you can also fetch fields from editions separately from those on the work, like so:

https://openlibrary.org/search.json?q=crime+and+punishment&fields=key,title,author_name,editions,editions.key,editions.title,editions.ebook_access,editions.language

{
    "numFound": 2421,
    "start": 0,
    "numFoundExact": true,
    "docs": [
        {
            "key": "/works/OL166894W",
            "title": "Преступление и наказание",
            "author_name": ["Фёдор Михайлович Достоевский"],
            "editions": {
                "numFound": 290,
                "start": 0,
                "numFoundExact": true,
                "docs": [
                    {
                        "key": "/books/OL37239326M",
                        "title": "Crime and Punishment",
                        "language": [
                            "eng"
                        ],
                        "ebook_access": "public"
                    }
                ]
            }
        },
    ...
Notes:
- Currently only one edition is displayed ; we are planning to add support for pagination so you can specify editions.row or editions.start.
- You can add &editions.sort to override the default relevance logic and instead sort by a specific field.
- You can see the exact boosting logic in the code here: https://github.com/internetarchive/openlibrary/blob/dc49fddb78a3cb25138922790ddd6a5dd2b5741c/openlibrary/plugins/worksearch/schemes/works.py#L439-L448


Index of APIs
Book Search API - Search results for books, authors, and more
Search inside API - Search for matching text within millions of books
Covers API - Fetch book covers by ISBN or Open Library identifier
Your Books API - Retrieve books on a patron's public reading log
Lists API - Reading, modifying, or creating user lists
-RESTful APIs
Work & Edition APIs - Retrieve a specific work or edition by identifier
Authors API - Retrieve an author and their works by author identifier
Subjects API - Fetch books by subject name
Recent Changes API - Programatic access to changes across Open Library
Legacy APIs:
- Legacy Partner API API -- Formerly the "Read" API, fetch one or more books by library identifiers (ISBNs, OCLC, LCCNs)
- Legacy JSON API is deprecated and preserved for backward compatibility.

More APIs
Nearly every item on Open Library has an API version. You can return structured bibliographic data for any Open Library page by adding a .rdf/.json/.yml extension to the end of any Open Library identifier.

For instance: https://openlibrary.org/works/OL15626917W.json or https://openlibrary.org/authors/OL33421A.json. Many pages, such as the Books, Authors, and Lists, will include links to their RDF and JSON formats.

The history of an item can be accessed by appending ?m=history to the page like this.

Services using Open Library APIs
Several developers are creating amazing things with the Open Library APIs:

Trove by the National Library of Australia
Trove is a new discovery experience focused on Australia and Australians. It supplements what search engines provide with reliable information from Australia's memory institutions. The system hits Open Library when public domain books turn up in searches, and displays links to Open Library.
 
Koha
Koha is an open source library system for public libraries that includes catalog searches and member organizing. It uses Open Library covers, displays OL related subjects, and lendable eBooks using the Read API.
 
Evergreen
Evergreen is highly-scalable software for libraries that helps library patrons find library materials, and helps libraries manage, catalog, and circulate those materials. It uses Open Library for covers, tables of contents, with plans to expand into other areas.
 
read.gov by the Library of Congress
OK, this isn't exactly Open Library, but it's still awesome! The Library of Congress have modified the Internet Archive's Book Reader to sit perfectly within their Rare Books Collection site.
 
OpenBook WordPress Plug-in by John Miedema
OpenBook is useful for anyone who wants to add book covers and other book data on a WordPress website. OpenBook links to detailed book information in Open Library, the main data source, as well as other book sites. Users have complete control over the display through templates. OpenBook can link to library records by configuring an OpenURL resolver or through a WorldCat link. OpenBook inserts COinS so that other applications like Zotero can pick up the book data.
 
Umlaut by Jason Ronallo
Umlaut is a middle-tier OpenURL link resolver that adds functions and services to commercial link resolving software.
 
Virtual Shelf by Jonathan Breitbart and Devin Blong (UC Berkeley School of Information)
The Virtual Shelf is a visualization created by two students at the UC Berkeley School of Information. The project includes the student's master thesis, with research into the searching and browsing patterns of library patrons. The Open Library RESTful API was utilized during the project as a source of metadata for the user interface.
 
RDC UI Toolkit by Rural Design Collective
This group created a suite of tools that facilitates the creation of localized user interfaces for public domain books. The RDC used the Open Library Covers API and the Internet Archive Book Reader in their online demonstration customized for the OLPC XO.
 
Dreambooks.club by Bernat Fortet
Dreambooks is a portal and community where parents and children can discover new books to read together. Think of it as the online equivalent of your library's children's corner. All the book data is powered by OpenLibary's API.
 
MyBooks.Life by Mark Webster
MyBooks.Life is an android app and website designed primarily to manage TBR (to-be-read) lists. You can keep track of your reading progress, make notes, manage your wishlist, and rate your books. MyBooks.Life uses Open Library data to power its search.
 
Bookmind
Bookmind is now available at https://apps.apple.com/app/bookmind/id6593662584. It uses open library’s api exclusively for book data. You can even see the rough prototype source at https://github.com/dave-ruest/Bookmind.
 
Hobbyverse let's you track all your hobbies in one place. Users can add their books to their digital library and track their progress reading books, view what books their friends are reading, earn achievements, etc.
 
ReadOtter
ReadOtter, a classroom library management app designed to help teachers organize their classroom libraries.
 
Chapter
Chapter is an online reading library and reading organizer app.
 
Land of Readers is a free, easy-to-use book discovery tool designed to help readers find books that match their interests, age group, and reading level.
 
Austen is a web app that uses the Open Library API to generate visual character relationship diagrams for books using AI. Here is a live demo of their work.
 
mcp-open-library by Ben Smith
A Model Context Protocol (MCP) server for the Open Library API that enables AI assistants to search for book and author information. The source code can be found here. So far on a MCP server website its been called 5.2k times: https://smithery.ai/server/@8enSmith/mcp-open-library. It has also been published to npm: https://www.npmjs.com/package/mcp-open-library.
Are you using the Open Library APIs? We'd love to hear about it! Please email us at openlibrary@archive.org.

Introduction
The Internet Archive is pleased to provide API endpoints for search access to items in the archive; in particular, by searching against the metadata stored for items.

advancedsearch.php
The traditional method for API access for search is the Advanced Search API. The advanced search page describes the formats provided, and the query language for searching.

We limit the number of sorted paged results returnable to 10,000. Paged sorted results are supported only until the 10,000th result. For example, the search:

https://archive.org/advancedsearch.php?q=subject:palm+pilot+software&output=json&rows=100&page=5

should be fine, but requesting page=10000 is rejected.

Scraping API
To provide the ability to page deeply into the items at the Archive, we are now providing a scraping API. The scraping API uses a cursor approach. One makes a scraping API call, which will return a list of results and a cursor. The cursor can then be used to search again with the search continuing where the cursor left off.

The following pseudo-code (it's really Python) shows a yield loop that loops through all of the results of a search by using a cursor:

def yield_results(basic_params):
        result = requests.get(endpoint, params=basic_params)
        while True:
            if (result.status_code != 200):
                yield (None, result.json())
                break
            else:
                result_obj = result.json()
                yield (result_obj, None)
                cursor = result_obj.get('cursor', None)
                if cursor is None:
                    break
                else:
                    params = basic_params.copy()
                    params['cursor'] = cursor
                    result = requests.get(endpoint, params=params)
The scraping API can be found at: https://archive.org/services/search/v1/scrape.

Its parameters are:

q: the query (using the same query Lucene-like queries supported by Internet Archive Advanced Search.
fields: Metadata fields to return, comma delimited
sorts: Fields to sort on, comma delimited (if identifier is specified, it must be last)
count: Number of results to return (minimum of 100)
cursor: A cursor, if any (otherwise, search starts at the beginning)
total_only: if this is set to true, then only the number of results is returned.
A description of these fields (in Swagger/OpenAPI format format) can be found at htttps://archive.org/services/search/v1.

Example
Here is an example CURL session scraping for items in the NASA collection: https://archive.org/services/search/v1/scrape?fields=title&q=collection%3Anasa


    > curl "https://archive.org/services/search/v1/scrape?fields=title&q=collection%3Anasa"
    {"items":[{"title":"International Space Station exhibit","identifier":"00-042-154"} ... ],
    "total":198879,"count":100,"cursor":"W3siaWRlbnRpZmllciI6IjE5NjEtTC0wNTkxNCJ9XQ=="}
    > curl "https://archive.org/services/search/v1/scrape?fields=title&q=collection%3Anasa&cursor=W3siaWRlbnRpZmllciI6IjE5NjEtTC0wNTkxNCJ9XQ=="
    
Note that there is no absolute guarantee that every item will be returned, or that every item returned will remain in the Archive. Additions and deletions happen all the time, and it's possible that an item could be added or deleted during the scraping loop. The total value returned is the number of items that match the search criteria (including the count). If a cursor is provided, the total refers, not to the total of all items, but the total of all items from the point of the cursor.

Internet command-line tool
The Internet Archive command line tool, named ia, is available for using Archive.org from the command-line. It also installs the internetarchive Python module for programatic access to archive.org. Version 1.0.0 and above use the scraping API transparently. Older versions must be upgraded for search operations to work properly.

How to Use Node.js SDK in Next.js Server Components
To integrate the Clarifai Node.js SDK in a Next.js App Directory project with server components, you need to explicitly add the clarifai-nodejs-grpc package to the serverComponentsExternalPackages configuration in your next.config.js file.

This ensures that Next.js properly handles the gRPC dependencies required by the Clarifai SDK, allowing you to use AI-powered inference in your server-side components.

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['clarifai-nodejs-grpc'],
  },
}

module.exports = nextConfig

Minimum System Requirements
The Clarifai Node.js package is lightweight and designed to run on any modern system.

You’ll need Node.js version 18 or higher to run it.

Note: The package supports all major operating systems (Windows, macOS — including Intel and Apple Silicon — and Linux) as long as Node.js 18+ is installed.

API PRODUCTS
Curated API Marketplace Trusted by over 1 million developers for secure and scalable REST APIs.
Explore Marketplace
Lookup Get the tools you need to take control of your online audience and user journey every step of the way.
Ipstack IP address intelligence API and geolocation lookup
Ipapi IP address location & Reverse IP Lookup API
userstack User-Agent lookup and device detection API
languagelayer Language detection API for 173 world languages
positionstack Forward and reverse batch geocoding & maps API
countrylayer Detailed information about countries from all over the world
Verification Enhance security and reduce cost by verifying user data at the point of entry into your system.
mailboxlayer SMTP-based email address validation & verification API
numverify International phone number validation API
vatlayer EU VAT number validation & EU VAT rates lookup API
Data Make use of high-quality and real-time data APIs to boost efficiency and ease the burden on your backend.
currencylayer Reliable currency conversion API for 168 world currencies
fixer Foreign exchange rates & currency conversion API
coinlayer Crypto currency exchange rates & conversion API
weatherstack Real-time world weather data & forecasts API
aviationstack Real-time and historical flight tracking & status API
marketstack Real-time, intraday & historical stock data API
mediastack Live News, Headlines & Blog Articles JSON API
Conversion Transform data with ease using automated API-based conversion tools that integrate with your application.
screenshotlayer Queueless URL to PNG screenshot conversion API
pdflayer Powerful HTML or URL to PDF conversion API
scrapestack Real-Time Proxy & Web Scraping API
serpstack Real-Time Google Search & SERP API
Market You API! APILayer is an API marketplace where your API can reach broader audiences.
List Your API

Step 1: Your API Access Key

This is your API Access Key, your personal key required to authenticate with the API.
Keep it safe! You can reset it at any time in your Account Dashboard.

39d29ad27de285c1cbd4a0612e390485
Step 2: API Endpoints

There are two API endpoints to choose from:

News Data: Get live & historical news data.
News Sources: Get a list of news sources.
Base URL: API requests start out with the following base URL:

http://api.mediastack.com/v1/


Make API Request: Let's try making a few simple API requests for live news data, historical news data and news sources. Take a look at the box below and click the API requests to open them in your browser.

Make API Requestrequired and optional
LIVE NEWSHISTORICAL NEWSNEWS SOURCES

// Live News Data

http://api.mediastack.com/v1/news
    ? access_key = YOUR_ACCESS_KEY
    
// optional parameters: 

    & sources = cnn,bbc
    & categories = business,sports
    & countries = us,au
    & languages = en,-de
    & keywords = virus,-corona
    & sort = published_desc
    & offset = 0
    & limit = 100
    

To learn more about API requests and parameters, please refer to the API Documentation.

Step 3: Integrate into your application

This was barely scratching the surface of the mediastack API. For specific integration guides and code examples, please have a look at the API's Documentation.

Should you require assistance of any kind, please contact our support team at

Manage your API Keys
Create a new key

Name	Key	Actions
Primary	9f67bc5acfde481e8e0b273d033c9d98	RotateRename


Domain whitelisting
If you are using your API on the front-end. You can choose to restrict calls so Abstract only accepts requests originating from certain domains.
You can whitelist subdomains (ie app.domain.com), root domains (domain.com) or all subdomains of a specific domain using wildcards (*.domain.com)

APIs to create
Web Scraping API
Abstract’s Web Scraping API is a simple yet powerful REST API used to extract data from a given URL. To make a request, you simply include the target URL and your API key, and Abstract’s API will return the data from that site.

GET
/
v1

Try it
It’s very simple to use: you only need to submit your api_key and a target URL, and the API will return the data from that site.
​
Getting started
​
REST
The Web Scraping API, like all of Abstract’s APIs, is organized around REST. It is designed to use predictable, resource-oriented URLs and to use HTTP status codes to indicate errors.
​
HTTPS
The Web Scraping API requires all communications to be secured with TLS 1.2 or greater.
​
API Versions
All of Abstract’s APIs are versioned. The Web Scraping API is currently on Version 1.
​
Your API Key
Your API key is your unique authentication key to be used to access Abstract’s Web Scraping API. Note that each of Abstract’s APIs has a unique API key, so you will need different keys to access the Web Scraping and Email Validation APIs, for example. To authenticate your requests, you will need to append your API key to the base URL.
​
Base URL
https://scrape.abstractapi.com/v1/
​
Validation endpoint
Abstract’s Web Scraping API simply requires your unique api_key and the target URL you’d like to scrape:
https://scrape.abstractapi.com/v1/
? api_key = YOUR_UNIQUE_API_KEY
& url = https://news.ycombinator.com
This was a successful request, so the information from the provided website is returned below:
​
Request parameters
​
api_key
Stringrequired
Your unique API key. Note that each user has a unique API key for each of Abstract’s APIs, so your Web Scraping API key will not work for your User Avatar API, for example
​
url
Stringrequired
The URL to extract the data from. Note that this parameter should include the full HTTP Protocol (http:// or https://). If your URL has parameters, you should encode it. For example the & character would be encoded to %26.
​
render_js
Boolean
If true, the request will render JavaScript on the target site. Note that JavaScript is rendered via a Google Chrome headless browser. Defaults to false.
​
use_proxy
Boolean
If true the request will use a different IP address on each call. Defaults to false.
​
cookie_jar
Array
It can be used to make requests with preloaded cookies. The array can contain multiple objects, each with the following properties: path, value, name, and domain.
[
  {
    "path": "path",
    "value": "value",
    "name": "name",
    "domain": "domain"
  },
  {
    "path": "path",
    "value": "value",
    "name": "name",
    "domain": "domain"
  }
]
Company Enrichment API
Pricing
Try it out
Documentation
Integrations New
Usage
Settings
Support
Unlock more calls and features
You are currently on a free plan with limited features and usage
Upgrade
Try it out
This is your private API key, specific to this API.
Primary Key:5cd799d1c7464cf1a133fd7e9f39bd4f
Create, rotate and manage your keys
Live test
cURL
Javascript
jQuery
NodeJS
Python
Ruby
Java
PHP
Go
Postman
https://companyenrichment.abstractapi.com/v2/?api_key=5cd799d1c7464cf1a133fd7e9f39bd4f&domain=airbnb.com
Documentation
Make test request
Abstract API Inc.Terms of servicePrivacy policy

Popular APIs
Company Enrichment API
With Abstract’s Company Enrichment API, you can easily get detailed information about any company domain.

GET
/
v2

Try it
It’s very simple to use: you are only required to send your unique api_key and the domain you want to enrich to get information about the company.
​
Getting started
​
REST
The Company Enrichment API, like all of Abstract’s APIs, is organized around REST. It is designed to use predictable, resource-oriented URLs and to use HTTP status codes to indicate errors.
​
HTTPS
The Company Enrichment API requires all communications to be secured with TLS 1.2 or greater.
​
API Versions
All of Abstract’s APIs are versioned. The Company Enrichment API is currently on Version 2.
​
Your API Key
Your API key is your unique authentication key to be used to access Abstract’s Company Enrichment API. Note that each of Abstract’s APIs has a unique API key, so you will need different keys to access the Company Enrichment and Email Validation APIs, for example. To authenticate your requests, you will need to append your API key to the base URL.
​
Base URL
https://companyenrichment.abstractapi.com/v2
​
Validation endpoint
Abstract’s Company Enrichment API simply requires your unique API key and the domain you’d like to enrich:
https://companyenrichment.abstractapi.com/v2
? api_key = YOUR_UNIQUE_API_KEY
& domain = airbnb.com
This was a successful request, so the company details associated with the domain are returned below:
​
Request parameters
​
api_key
Stringrequired
Your unique API key. Note that each user has unique API keys for each of Abstract’s APIs, so your Company Enrichment API key will not work for your IP Geolocation API, for example.
​
domain
Stringrequired
The domain of the company you want to get data from.
​
fields
String
You can chose to only receive a few fields from the JSON response. To do so, you can include a fields value in the query parameters with a comma separated list of the top-level keys you want to be returned. For example, adding ?fields=domain will return only the domain in the JSON response.
​
Response parameters
The API response is returned in a universal and lightweight JSON format.
​
domain
String
The domain the company website is hosted on.
​
company_name
String
The name of the company.
​
description
String
A brief description of the company.
​
logo
String
The URL to download the company’s logo.
​
year_founded
String
The year the company was founded.
​
street_address
String
The number and name of the street the company is based in.
​
city
String
The city or regiont he company headquarter is based in.
​
state
String
The state the company is based in.
​
country
String
The country the company is based in.
​
country_iso_code
String
Country’s ISO 3166-1 alpha-2 code.
​
postal_code
String
ZIP or postal code.
​
latitude
Float
Decimal of the latitude.
​
longitude
Float
Decimal of the longitude.
​
sic_code
String
Code that indicates the industry of the company
​
naics_code
String
Code that indicates the industry of the company
​
industry
String
The industry the company is operating in.
​
employee_count
String
The approximate number of employees of the company.
​
employee_range
String
The approximate range of employees of the company.
​
annual_revenue
String
The approximate annual reveneu of the company.
​
revenue_range
String
The approximate range of revenue of the company.
​
phone_numbers
Array
Array with the phone numbers of the company.
​
email_addresses
Array
Array with the emails addresess to contact the company.
​
type
String
Indicates if the company is public or private.
​
ticker
String
If the company is public, it will show the company’s ticker.
​
exchange
String
If the company is public, it will show the company’s exchange.
​
global_ranking
String
Indicates if the company is listes on the Umbrella top 1 Million companies.
​
tags
Array
Array with the company’s tags.
​
technologies
Array
Array with the company’s tech tags.
​
linkedin_url
String
Linkedin URL
​
facebook_url
String
Facebook URL
​
twitter_url
String
Twitter/X URL
​
instagram_url
String
Instagram URL
​
crunchbase_url
String
Crunchbase URL
​
Response and error codes
Whenever you make a request that fails for some reason, an error is returned in JSON format. The errors include an error code and description, which you can find detailed below.
Code	Type	Details
200	OK	Everything worked as expected.
400	Bad request	Bad request.
401	Unauthorized	The request was unacceptable. Typically due to the API key missing or incorrect.
422	Quota reached	The request was aborted due to insufficient API credits. (Free plans)
429	Too many requests	The request was aborted due to the number of allowed requests per second being reached. This happens on free plans as requests are limited to 1 per second.
500	Internal server error	The request could not be completed due to an error on the server side.
503	Service unavailable	The server was unavailable.
​
Code samples and libraries
Please see the top of this page for code samples for these languages and more. If we’re missing a code sample, or if you’d like to contribute a code sample or library in exchange for free credits, email us at: team@abstractapi.com
​
Other notes
A note on metered billing: Each individual domain you submit for lookup counts as a credit used. Credits are counted per request, not per successful response. So if you submit a request for the (invalid) domain “kasj8929hs”, that still counts as 1 credit.

Avatars API
Pricing
Try it out
Documentation
Integrations New
Usage
Settings
Support
Unlock more calls and features
You are currently on a free plan with limited features and usage
Upgrade
Try it out
This is your private API key, specific to this API.
Primary Key:bf2c776439564d34b27e34d4daecd079
Create, rotate and manage your keys
Live test
cURL
Javascript
jQuery
NodeJS
Python
Ruby
Java
PHP
Go
Postman
https://avatars.abstractapi.com/v1/?api_key=bf2c776439564d34b27e34d4daecd079&name=Claire Florentz
Documentation

I built Clime — a lightweight terminal UI component library for Go
Hi everyone,

I've recently built a Go library called Clime to make it easier and more fun to build interactive terminal applications.

Clime provides simple, minimal, and beautiful terminal UI components like:

spinners

progress bars

text prompts

multi-select inputs

tables

color formatting

banners (success, error, info)

The goal was to avoid the complexity of full frameworks like BubbleTea, and instead offer plug-and-play components with sane defaults, so you can build better CLIs without any boilerplate.

It’s dependency-light, has a clean API, and works out-of-the-box with minimal setup.

Github Repo: https://github.com/alperdrsnn/clime

Would love feedback, feature suggestions, or just general thoughts! Also happy to accept contributions if anyone’s interested.

Thanks!


API Keys
Manage the keys used to access Enigma Console

API Keys
2
Name, owner or key
ENIGMA API KEY BELOW INTEGRATEPROPERLY
Name
Owner
Key

Default Workspace
Service
PzJKU3Vx0ySVjrAtKKcYRI4icahw2pHA1l04uBQT



zebbroka@gmail.com
Default
zebbroka@gmail.com
You
WznCm2Y9hjrEqQqR1FjwmeUrulA30enMLPggPoTR


Overview

Intro
Welcome to the Pulsedive API!

Pulsedive's UI is built using the API, so you've actually been using it already. This architecture means that many of the things you are able to do with the UI you can do with the API, so it's very flexible and should meet your needs, but if you have any questions or suggestions please don't hesitate to reach out to us.

API Key
You should always provide your API key when accessing the API. Rate limits are based on your API plan and can be viewed on your Account page. You can technically access the API without an API key, but rate limits are much more stringent.

Location
All queries should be directed to the following paths.
/api/info.php
Retrieve information on indicators, threats, feeds, and related data.
/api/explore.php
Explore and search indicators using the Explore query language.
/api/analyze.php
Scan indicators and retrieve results.

Passive scanning used to be referred to as "analyzing" while active scanning was "probing," so you will probably see some remnants of that language in some requests.

Rate Limit
Pulsedive has rate limits for number of requests per second, per day, and per month. These vary based on your API plan; some plans remove a rate limit for a particular period entirely or offer soft limits. Soft limits mean we don't limit your requests with an error code, but if you're consistently going over your plan limits we'll notify you to upgrade or reduce your request rate.

The number of requests remaining per period are provided in HTTP headers with each request. If a header is missing, you do not have a rate limit for that period. However, some rate limit headers may also not be present when you hit a rate limit and receive a 429 error code, so you should check both the HTTP headers and the HTTP response code to determine if you should slow your request rate.
X-Requests-Remaining-Second: 1
X-Requests-Remaining-Day: 9
X-Requests-Remaining-Month: 249

Our Pro and API plans provide increased limits. Once you subscribe to a plan, you can view your limits on the Account page.

When the rate limit is reached, you will get an HTTP response code of 429. You will also receive this error code if you attempt queries that surpass other limits, like the Explore result limit. The response object for hitting the rate limit looks something like this:
{
	"error": "API rate limit exceeded: 1 requests per second. Visit pulsedive.com\/api to view limits and upgrade your plan."
}
	


 Sleek and completely delivers on its promise of "ease of integration". If you're building out blue team capabilities, Pulsedive is something to have on your radar.
Wim Remes - Managing Director of Damovo Security Services EMEA

Purple Air Logo

Organization F0EAD9D2
1,000,000 Points

Shayan Khadir
API Keys
Search Keys
Type (All)
Projects (All)
Users (All)
Keys (2)
Archived Keys (0)
Key
ascending order
Project
Status
Recent Usage	Actions
45382888-1A8C-11F1-B596-4201AC1DC123
Read
Project 69E38868
.
Enabled
No Data
48D73F83-1A8C-11F1-B596-4201AC1DC123
Write
Project 69E38868
.
Enabled
No Data
Items per page:
25
1 – 2 of 2
PurpleAir, Inc.© 2026 | Please read our terms of service, data license, data attribution and privacy policy. | Visit the API Docs, PurpleAir Community, Facebook Group or Instagram Pages | Get a sensor or view the Real-Time Map


> ## Documentation Index
> Fetch the complete documentation index at: https://docs.discord.com/llms.txt
> Use this file to discover all available pages before exploring further.

# OAuth2

export const Route = ({method, children}) => {
  return <div className="MDXRoute">
      <span className={"verb" + " " + method.toLowerCase()}>{method}</span>
      <span className="url">{children}</span>
    </div>;
};

export const ManualAnchor = ({id}) => {
  return <div className="MDXManualAnchor" id={id}></div>;
};

OAuth2 enables application developers to build applications that utilize authentication and data from the Discord API. Within Discord, there are multiple types of OAuth2 authentication. We support the authorization code grant, the implicit grant, client credentials, and some modified special-for-Discord flows for Bots and Webhooks.

## Shared Resources

The first step in implementing OAuth2 is [registering a developer application](https://discord.com/developers/applications) and retrieving your client ID and client secret. Most people who will be implementing OAuth2 will want to find and utilize a library in the language of their choice. For those implementing OAuth2 from scratch, please see [RFC 6749](https://tools.ietf.org/html/rfc6749) for details. After you create your application with Discord, make sure that you have your `client_id` and `client_secret` handy. The next step is to figure out which OAuth2 flow is right for your purposes.

<ManualAnchor id="shared-resources-oauth2-urls" />

###### OAuth2 URLs

| URL                                                                                        | Description                                                 |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| [https://discord.com/oauth2/authorize](https://discord.com/oauth2/authorize)               | Base authorization URL                                      |
| [https://discord.com/api/oauth2/token](https://discord.com/api/oauth2/token)               | Token URL                                                   |
| [https://discord.com/api/oauth2/token/revoke](https://discord.com/api/oauth2/token/revoke) | [Token Revocation](https://tools.ietf.org/html/rfc7009) URL |

<Warning>
  In accordance with the relevant RFCs, the token and token revocation URLs will **only** accept a content type of `application/x-www-form-urlencoded`. JSON content is not permitted and will return an error.
</Warning>

<ManualAnchor id="shared-resources-oauth2-scopes" />

###### OAuth2 Scopes

These are a list of all the OAuth2 scopes that Discord supports. Some scopes require approval from Discord to use. Requesting them from a user without approval from Discord may cause errors or undocumented behavior in the OAuth2 flow.

| Name                                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| activities.read                          | allows your app to fetch data from a user's "Now Playing/Recently Played" list — not currently available for apps                                                                                                                                                                                                                                                                                                          |
| activities.write                         | allows your app to update a user's activity - not currently available for apps (NOT REQUIRED FOR [GAMESDK ACTIVITY MANAGER](/developers/developer-tools/game-sdk#activities))                                                                                                                                                                                                                                              |
| applications.builds.read                 | allows your app to read build data for a user's applications                                                                                                                                                                                                                                                                                                                                                               |
| applications.builds.upload               | allows your app to upload/update builds for a user's applications - requires Discord approval                                                                                                                                                                                                                                                                                                                              |
| applications.commands                    | allows your app to add [commands](/developers/interactions/application-commands) to a guild - included by default with the `bot` scope                                                                                                                                                                                                                                                                                     |
| applications.commands.update             | allows your app to update its [commands](/developers/interactions/application-commands) using a Bearer token - [client credentials grant](/developers/topics/oauth2#client-credentials-grant) only                                                                                                                                                                                                                         |
| applications.commands.permissions.update | allows your app to update [permissions for its commands](/developers/interactions/application-commands#permissions) in a guild a user has permissions to                                                                                                                                                                                                                                                                   |
| applications.entitlements                | allows your app to read entitlements for a user's applications                                                                                                                                                                                                                                                                                                                                                             |
| applications.store.update                | allows your app to read and update store data (SKUs, store listings, achievements, etc.) for a user's applications                                                                                                                                                                                                                                                                                                         |
| bot                                      | for oauth2 bots, this puts the bot in the user's selected guild by default                                                                                                                                                                                                                                                                                                                                                 |
| connections                              | allows [`/users/@me/connections`](/developers/resources/user#get-current-user-connections) to return linked third-party accounts                                                                                                                                                                                                                                                                                           |
| dm\_channels.read                        | allows your app to see information about the user's DMs and group DMs - requires Discord approval                                                                                                                                                                                                                                                                                                                          |
| email                                    | enables [`/users/@me`](/developers/resources/user#get-current-user) to return an `email`                                                                                                                                                                                                                                                                                                                                   |
| gdm.join                                 | allows your app to [join users to a group dm](/developers/resources/channel#group-dm-add-recipient)                                                                                                                                                                                                                                                                                                                        |
| guilds                                   | allows [`/users/@me/guilds`](/developers/resources/user#get-current-user-guilds) to return basic information about all of a user's guilds                                                                                                                                                                                                                                                                                  |
| guilds.join                              | allows [`/guilds/{guild.id}/members/{user.id}`](/developers/resources/guild#add-guild-member) to be used for joining users to a guild                                                                                                                                                                                                                                                                                      |
| guilds.members.read                      | allows [`/users/@me/guilds/{guild.id}/member`](/developers/resources/user#get-current-user-guild-member) to return a user's member information in a guild                                                                                                                                                                                                                                                                  |
| identify                                 | allows [`/users/@me`](/developers/resources/user#get-current-user) without `email`                                                                                                                                                                                                                                                                                                                                         |
| messages.read                            | for local rpc server api access, this allows you to read messages from all client channels (otherwise restricted to channels/guilds your app creates)                                                                                                                                                                                                                                                                      |
| relationships.read                       | Allows your app to access a user’s Discord Friends list, their pending requests, and blocked users. This scope is part of our Social SDK - [submit for access here](https://discord.com/developers/applications/select/social-sdk/getting-started). [Social SDK Terms apply](https://support-dev.discord.com/hc/en-us/articles/30225844245271-Discord-Social-SDK-Terms), including Section 5(a)(ii) to the data you obtain |
| role\_connections.write                  | allows your app to update a user's connection and metadata for the app                                                                                                                                                                                                                                                                                                                                                     |
| rpc                                      | for local rpc server access, this allows you to control a user's local Discord client - requires Discord approval                                                                                                                                                                                                                                                                                                          |
| rpc.activities.write                     | for local rpc server access, this allows you to update a user's activity - requires Discord approval                                                                                                                                                                                                                                                                                                                       |
| rpc.notifications.read                   | for local rpc server access, this allows you to receive notifications pushed out to the user - requires Discord approval                                                                                                                                                                                                                                                                                                   |
| rpc.voice.read                           | for local rpc server access, this allows you to read a user's voice settings and listen for voice events - requires Discord approval                                                                                                                                                                                                                                                                                       |
| rpc.voice.write                          | for local rpc server access, this allows you to update a user's voice settings - requires Discord approval                                                                                                                                                                                                                                                                                                                 |
| voice                                    | allows your app to connect to voice on user's behalf and see all the voice members - requires Discord approval                                                                                                                                                                                                                                                                                                             |
| webhook.incoming                         | this generates a webhook that is returned in the oauth token response for authorization code grants                                                                                                                                                                                                                                                                                                                        |

<Info>
  In order to add a user to a guild, your bot has to already belong to that guild. `role_connections.write` cannot be used with the [Implicit grant type](/developers/topics/oauth2#implicit-grant).
</Info>

## State and Security

Before we dive into the semantics of the different OAuth2 grants, we should stop and discuss security, specifically the use of the `state` parameter. [Cross-site request forgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery), or CSRF, and [Clickjacking](https://en.wikipedia.org/wiki/Clickjacking) are security vulnerabilities that must be addressed by individuals implementing OAuth. This is typically accomplished using the `state` parameter. `state` is sent in the authorization request and returned back in the response and should be a value that binds the user's request to their authenticated state. For example, `state` could be a hash of the user's session cookie, or some other nonce that can be linked to the user's session.

When a user begins an authorization flow on the client, a `state` is generated that is unique to that user's request. This value is stored somewhere only accessible to the client and the user, i.e. protected by the [same-origin policy](https://en.wikipedia.org/wiki/Same-origin_policy). When the user is redirected, the `state` parameter is returned. The client validates the request by checking that the `state` returned matches the stored value. If they match, it is a valid authorization request. If they do not match, it's possible that someone intercepted the request or otherwise falsely authorized themselves to another user's resources, and the request should be denied.

While Discord does not require the use of the `state` parameter, we support it and highly recommend that you implement it for the security of your own applications and data.

## Authorization Code Grant

The authorization code grant is what most developers will recognize as "standard OAuth2" and involves retrieving an access code and exchanging it for a user's access token. It allows the authorization server to act as an intermediary between the client and the resource owner, so the resource owner's credentials are never shared directly with the client.

All calls to the OAuth2 endpoints require either HTTP Basic authentication or `client_id` and `client_secret` supplied in the form data body.

<ManualAnchor id="authorization-code-grant-authorization-url-example" />

###### Authorization URL Example

```
https://discord.com/oauth2/authorize?response_type=code&client_id=157730590492196864&scope=identify%20guilds.join&state=15773059ghq9183habn&redirect_uri=https%3A%2F%2Fnicememe.website&prompt=consent&integration_type=0
```

`client_id` is your application's `client_id`. `scope` is a list of [OAuth2 scopes](/developers/topics/oauth2#shared-resources-oauth2-scopes) separated by url encoded spaces (`%20`). `redirect_uri` is whatever URL you registered when creating your application, url-encoded. `state` is the unique string mentioned in [State and Security](/developers/topics/oauth2#state-and-security).

When someone navigates to this URL, they will be prompted to authorize your application for the requested scopes. On acceptance, they will be redirected to your `redirect_uri`, which will contain an additional querystring parameter, `code`. `state` will also be returned if previously sent, and should be validated at this point.

`prompt` controls how the authorization flow handles existing authorizations. If a user has previously authorized your application with the requested scopes and prompt is set to `consent`, it will request them to reapprove their authorization. If set to `none`, it will skip the authorization screen and redirect them back to your redirect URI without requesting their authorization. For passthrough scopes, like `bot` and `webhook.incoming`, authorization is always required.

The `integration_type` parameter specifies the [installation context](/developers/resources/application#installation-context) for the authorization. The installation context determines where the application will be installed, and is only relevant when `scope` contains `applications.commands`. When set to 0 (GUILD\_INSTALL) the application will be authorized for installation to a server, and when set to 1 (USER\_INSTALL) the application will be authorized for installation to a user. The application must be configured in the Developer Portal to support the provided `integration_type`.

<ManualAnchor id="authorization-code-grant-redirect-url-example" />

###### Redirect URL Example

```
https://nicememe.website/?code=NhhvTDYsFcdgNLnnLijcl7Ku7bEEeee&state=15773059ghq9183habn
```

`code` is now exchanged for the user's access token by making a `POST` request to the [token URL](/developers/topics/oauth2#shared-resources-oauth2-urls) with the following parameters:

* `grant_type` - must be set to `authorization_code`
* `code` - the code from the querystring
* `redirect_uri` - the `redirect_uri` associated with this authorization, usually from your authorization URL

<ManualAnchor id="authorization-code-grant-access-token-exchange-example" />

###### Access Token Exchange Example

```python  theme={"system"}
import requests

API_ENDPOINT = 'https://discord.com/api/v10'
CLIENT_ID = '332269999912132097'
CLIENT_SECRET = '937it3ow87i4ery69876wqire'
REDIRECT_URI = 'https://nicememe.website'

def exchange_code(code):
  data = {
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': REDIRECT_URI
  }
  headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  r = requests.post('%s/oauth2/token' % API_ENDPOINT, data=data, headers=headers, auth=(CLIENT_ID, CLIENT_SECRET))
  r.raise_for_status()
  return r.json()
```

In response, you will receive:

<ManualAnchor id="authorization-code-grant-access-token-response" />

###### Access Token Response

```json  theme={"system"}
{
  "access_token": "6qrZcUqja7812RVdnEKjpzOL4CvHBFG",
  "token_type": "Bearer",
  "expires_in": 604800,
  "refresh_token": "D43f5y0ahjqew82jZ4NViEr2YafMKhue",
  "scope": "identify"
}
```

Having the user's access token allows your application to make certain requests to the API on their behalf, restricted to whatever scopes were requested. `expires_in` is how long, in seconds, until the returned access token expires, allowing you to anticipate the expiration and refresh the token. To refresh, make another `POST` request to the [token URL](/developers/topics/oauth2#shared-resources-oauth2-urls) with the following parameters:

* `grant_type` - must be set to `refresh_token`
* `refresh_token` - the user's refresh token

<ManualAnchor id="authorization-code-grant-refresh-token-exchange-example" />

###### Refresh Token Exchange Example

```python  theme={"system"}
import requests

API_ENDPOINT = 'https://discord.com/api/v10'
CLIENT_ID = '332269999912132097'
CLIENT_SECRET = '937it3ow87i4ery69876wqire'

def refresh_token(refresh_token):
  data = {
    'grant_type': 'refresh_token',
    'refresh_token': refresh_token
  }
  headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  r = requests.post('%s/oauth2/token' % API_ENDPOINT, data=data, headers=headers, auth=(CLIENT_ID, CLIENT_SECRET))
  r.raise_for_status()
  return r.json()
```

Boom; fresh [access token response](/developers/topics/oauth2#authorization-code-grant-access-token-response)!

<ManualAnchor id="authorization-code-grant-token-revocation-example" />

###### Token Revocation Example

To disable an access or refresh token, you can revoke it by making a `POST` request to the [token revocation URL](/developers/topics/oauth2#shared-resources-oauth2-urls) with the following parameters:

* `token` - the access token or refresh token to revoke
* `token_type_hint` *(optional)* - the `token` parameter's type—either `access_token` or `refresh_token`

<Warning>
  When you revoke a token, any active access or refresh tokens associated with that authorization will be revoked, regardless of the `token` and `token_type_hint` values you pass in.
</Warning>

```python  theme={"system"}
import requests

API_ENDPOINT = 'https://discord.com/api/v10'
CLIENT_ID = '332269999912132097'
CLIENT_SECRET = '937it3ow87i4ery69876wqire'

def revoke_access_token(access_token):
  data = {
    'token': access_token,
    'token_type_hint': 'access_token'
  }
  headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  requests.post('%s/oauth2/token/revoke' % API_ENDPOINT, data=data, headers=headers, auth=(CLIENT_ID, CLIENT_SECRET))
```

Boom; the tokens are safely revoked.

## Implicit Grant

The implicit OAuth2 grant is a simplified flow optimized for in-browser clients. Instead of issuing the client an authorization code to be exchanged for an access token, the client is directly issued an access token. The URL is formatted as follows:

<ManualAnchor id="implicit-grant-authorization-url-example" />

###### Authorization URL Example

```
https://discord.com/oauth2/authorize?response_type=token&client_id=290926444748734499&state=15773059ghq9183habn&scope=identify
```

On redirect, your redirect URI will contain additional **URI fragments**: `access_token`, `token_type`, `expires_in`, `scope`, and [`state`](/developers/topics/oauth2#state-and-security)(if specified). **These are not querystring parameters.** Be mindful of the "#" character:

<ManualAnchor id="implicit-grant-redirect-url-example" />

###### Redirect URL Example

```
https://findingfakeurlsisprettyhard.tv/#access_token=RTfP0OK99U3kbRtHOoKLmJbOn45PjL&token_type=Bearer&expires_in=604800&scope=identify&state=15773059ghq9183habn
```

There are tradeoffs in using the implicit grant flow. It is both quicker and easier to implement, but rather than exchanging a code and getting a token returned in a secure HTTP body, the access token is returned in the URI fragment, which makes it possibly exposed to unauthorized parties. **You also are not returned a refresh token, so the user must explicitly re-authorize once their token expires.**

## Client Credentials Grant

The client credential flow is a quick and easy way for bot developers to get their own bearer tokens for testing purposes. By making a `POST` request to the [token URL](/developers/topics/oauth2#shared-resources-oauth2-urls) with a grant type of `client_credentials`, using Basic authentication with your client id as the username and your client secret as the password, you will be returned an access token for the bot owner. Therefore, always be super-extra-very-we-are-not-kidding-like-really-be-secure-make-sure-your-info-is-not-in-your-source-code careful with your `client_id` and `client_secret`. We don't take kindly to imposters around these parts.

You can specify scopes with the `scope` parameter, which is a list of [OAuth2 scopes](/developers/topics/oauth2#shared-resources-oauth2-scopes) separated by spaces:

<Info>
  Team applications are limited to the `identify` and `applications.commands.update` scope, because teams are not bound to a specific user.
</Info>

<ManualAnchor id="client-credentials-grant-client-credentials-token-request-example" />

###### Client Credentials Token Request Example

```python  theme={"system"}
import requests

API_ENDPOINT = 'https://discord.com/api/v10'
CLIENT_ID = '332269999912132097'
CLIENT_SECRET = '937it3ow87i4ery69876wqire'

def get_token():
  data = {
    'grant_type': 'client_credentials',
    'scope': 'identify connections'
  }
  headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  r = requests.post('%s/oauth2/token' % API_ENDPOINT, data=data, headers=headers, auth=(CLIENT_ID, CLIENT_SECRET))
  r.raise_for_status()
  return r.json()
```

In return, you will receive an access token (without a refresh token):

<ManualAnchor id="client-credentials-grant-client-credentials-access-token-response" />

###### Client Credentials Access Token Response

```json  theme={"system"}
{
  "access_token": "6qrZcUqja7812RVdnEKjpzOL4CvHBFG",
  "token_type": "Bearer",
  "expires_in": 604800,
  "scope": "identify connections"
}
```

## Bot Users

Discord's API provides bot users, which are a separate type of user dedicated to automation. Bot users are automatically added to all apps, and are authenticated using the bot token found in your [app's settings](https://discord.com/developers/applications). Unlike the normal OAuth2 flow, bot users have full access to most API routes without using bearer tokens, and can connect to the [Real Time Gateway](/developers/events/gateway).

### Bot vs User Accounts

<Warning>
  Developers must abide by the [terms of service](https://support-dev.discord.com/hc/articles/8562894815383-Discord-Developer-Terms-of-Service), which includes refraining from automating standard user accounts (generally called "self-bots") outside of the OAuth2/bot API.
</Warning>

Bot users have a few differences compared to standard Discord users:

1. Bots are added to guilds through the OAuth2 API, and cannot accept normal invites.
2. Bots cannot have friends or be added to or join Group DMs.
3. [Verified bots](https://support-dev.discord.com/hc/en-us/articles/23926564536471-How-Do-I-Get-My-App-Verified) do not have a maximum number of guilds.
4. Bots have an entirely separate set of [rate limits](/developers/topics/rate-limits#rate-limits).

### Bot Authorization Flow

Bot authorization is a special server-less and callback-less OAuth2 flow that makes it easy for users to add bots to guilds. The URL you create looks similar to what we use for full stack implementation:

<ManualAnchor id="bot-authorization-flow-bot-auth-parameters" />

###### Bot Auth Parameters

| name                   | description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| client\_id             | your app's client id                                                  |
| scope                  | needs to include `bot` for the bot flow                               |
| permissions            | the [permissions](/developers/topics/permissions) you're requesting   |
| guild\_id              | pre-fills the dropdown picker with a guild for the user               |
| disable\_guild\_select | `true` or `false`—disallows the user from changing the guild dropdown |

<ManualAnchor id="bot-authorization-flow-url-example" />

###### URL Example

```
https://discord.com/oauth2/authorize?client_id=157730590492196864&scope=bot&permissions=1
```

In the case of bots, the `scope` parameter should be set to `bot`. There's also a new parameter, `permissions`, which is an integer corresponding to the [permission calculations](/developers/topics/permissions#permissions-bitwise-permission-flags) for the bot. You'll also notice the absence of `response_type` and `redirect_uri`. Bot authorization does not require these parameters because there is no need to retrieve the user's access token.

When the user navigates to this page, they'll be prompted to add the bot to a guild in which they have proper permissions. On acceptance, the bot will be added. Super easy!

If you happen to already know the ID of the guild the user will add your bot to, you can provide this ID in the URL as a `guild_id=GUILD_ID` parameter.
When the authorization page loads, that guild will be preselected in the dialog if that user has permission to add the bot to that guild. You can use this in conjunction with the parameter `disable_guild_select=true` to disallow the user from picking a different guild.

If your bot is super specific to your private clubhouse, or you just don't like sharing, you can leave the `Public Bot` option unchecked in your application's settings. If unchecked, only you can add the bot to guilds. If marked as public, anyone with your bot's URL can add it to guilds in which they have proper permissions.

### Advanced Bot Authorization

Devs can extend the bot authorization functionality. You can request additional scopes outside of `bot` and `applications.commands`, which will prompt a continuation into a complete [authorization code grant flow](/developers/topics/oauth2#authorization-code-grant) and add the ability to request the user's access token. If you request any scopes outside of `bot` and `applications.commands`, `response_type` is again mandatory; we will also automatically redirect the user to the first URI in your application's registered list unless `redirect_uri` is specified.

When receiving the access code on redirect, there will be additional querystring parameters of `guild_id` and `permissions`. The `guild_id` parameter should only be used as a hint as to the relationship between your bot and a guild. To be sure of the relationship between your bot and the guild, consider requiring the Oauth2 code grant in your bot's settings. Enabling it requires anyone adding your bot to a server to go through a full OAuth2 [authorization code grant flow](/developers/topics/oauth2#authorization-code-grant). When you retrieve the user's access token, you'll also receive information about the guild to which your bot was added:

<ManualAnchor id="advanced-bot-authorization-extended-bot-authorization-access-token-example" />

###### Extended Bot Authorization Access Token Example

```json  theme={"system"}
{
  "token_type": "Bearer",
  "guild": {
    "mfa_level": 0,
    "emojis": [],
    "application_id": null,
    "name": "SomeTest",
    "roles": [
      {
        "hoist": false,
        "name": "@everyone",
        "mentionable": false,
        "color": 0,
        "position": 0,
        "id": "290926798626357250",
        "managed": false,
        "permissions": 49794241,
        "permissions_new": "49794241"
      }
    ],
    "afk_timeout": 300,
    "system_channel_id": null,
    "widget_channel_id": null,
    "region": "us-east",
    "default_message_notifications": 1,
    "explicit_content_filter": 0,
    "splash": null,
    "features": [],
    "afk_channel_id": null,
    "widget_enabled": false,
    "verification_level": 0,
    "owner_id": "53908232999183680",
    "id": "2909267986347357250",
    "icon": null,
    "description": null,
    "public_updates_channel_id": null,
    "safety_alerts_channel_id": null,
    "rules_channel_id": null,
    "max_members": 100000,
    "vanity_url_code": null,
    "premium_subscription_count": 0,
    "premium_tier": 0,
    "preferred_locale": "en-US",
    "system_channel_flags": 0,
    "banner": null,
    "max_presences": null,
    "discovery_splash": null,
    "max_video_channel_users": 25
  },
  "access_token": "zMndOe7jFLXGawdlxMOdNvXjjOce5X",
  "scope": "bot",
  "expires_in": 604800,
  "refresh_token": "mgp8qnvBwJcmadwgCYKyYD5CAzGAX4"
}
```

### Two-Factor Authentication Requirement

For bots with [elevated permissions](/developers/topics/permissions#permissions-bitwise-permission-flags) (permissions with a `*` next to them), we enforce two-factor authentication on the owner's account when added to guilds that have server-wide 2FA enabled.

## Webhooks

Discord's webhook flow is a specialized version of an [authorization code](/developers/topics/oauth2#authorization-code-grant) implementation. In this case, the `scope` querystring parameter needs to be set to `webhook.incoming`:

<ManualAnchor id="webhooks-url-example" />

###### URL Example

```
https://discord.com/oauth2/authorize?response_type=code&client_id=157730590492196864&scope=webhook.incoming&state=15773059ghq9183habn&redirect_uri=https%3A%2F%2Fnicememe.website
```

When the user navigates to this URL, they will be prompted to select a channel in which to allow the webhook. When the webhook is [executed](/developers/resources/webhook#execute-webhook), it will post its message into this channel. On acceptance, the user will be redirected to your `redirect_uri`. The URL will contain the `code` querystring parameter which should be [exchanged for an access token](/developers/topics/oauth2#authorization-code-grant-access-token-exchange-example). In return, you will receive a slightly modified token response:

<ManualAnchor id="webhooks-webhook-token-response-example" />

###### Webhook Token Response Example

```json  theme={"system"}
{
  "token_type": "Bearer",
  "access_token": "GNaVzEtATqdh173tNHEXY9ZYAuhiYxvy",
  "scope": "webhook.incoming",
  "expires_in": 604800,
  "refresh_token": "PvPL7ELyMDc1836457XCDh1Y8jPbRm",
  "webhook": {
    "application_id": "310954232226357250",
    "name": "testwebhook",
    "url": "https://discord.com/api/webhooks/347114750880120863/kKDdjXa1g9tKNs0-_yOwLyALC9gydEWP6gr9sHabuK1vuofjhQDDnlOclJeRIvYK-pj_",
    "channel_id": "345626669224982402",
    "token": "kKDdjXa1g9tKNs0-_yOwLyALC9gydEWP6gr9sHabuK1vuofjhQDDnlOclJeRIvYK-pj_",
    "type": 1,
    "avatar": null,
    "guild_id": "290926792226357250",
    "id": "347114750880120863"
  }
}
```

From this object, you should store the `webhook.token` and `webhook.id`. See the [execute webhook](/developers/resources/webhook#execute-webhook) documentation for how to send messages with the webhook.

Any user that wishes to add your webhook to their channel will need to go through the full OAuth2 flow. A new webhook is created each time, so you will need to save the token and id. If you wish to send a message to all your webhooks, you'll need to iterate over each stored id:token combination and make `POST` requests to each one. Be mindful of our [Rate Limits](/developers/topics/rate-limits#rate-limits)!

## Get Current Bot Application Information

<Route method="GET">/oauth2/applications/@me</Route>

Returns the bot's [application](/developers/resources/application#application-object) object.

## Get Current Authorization Information

<Route method="GET">/oauth2/@me</Route>

Returns info about the current authorization. Requires authentication with a bearer token.

<ManualAnchor id="get-current-authorization-information-response-structure" />

###### Response Structure

| Field       | Type                                                                               | Description                                                                       |
| ----------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| application | partial [application](/developers/resources/application#application-object) object | the current application                                                           |
| scopes      | array of strings                                                                   | the scopes the user has authorized the application for                            |
| expires     | ISO8601 timestamp                                                                  | when the access token expires                                                     |
| user?       | [user](/developers/resources/user#user-object) object                              | the user who has authorized, if the user has authorized with the `identify` scope |

<ManualAnchor id="get-current-authorization-information-example-authorization-information" />

###### Example Authorization Information

```json  theme={"system"}
{
    "application": {
        "id": "159799960412356608",
        "name": "AIRHORN SOLUTIONS",
        "icon": "f03590d3eb764081d154a66340ea7d6d",
        "description": "",
        "hook": true,
        "bot_public": true,
        "bot_require_code_grant": false,
        "verify_key": "c8cde6a3c8c6e49d86af3191287b3ce255872be1fff6dc285bdb420c06a2c3c8"
    },
    "scopes": [
        "guilds.join",
        "identify"
    ],
    "expires": "2021-01-23T02:33:17.017000+00:00",
    "user": {
        "id": "268473310986240001",
        "username": "discord",
        "avatar": "f749bb0cbeeb26ef21eca719337d20f1",
        "discriminator": "0",
        "global_name": "Discord",
        "public_flags": 131072
    }
}
```

https://discord.com/api
> ## Documentation Index
> Fetch the complete documentation index at: https://docs.discord.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Sending Direct Messages

> Send direct messages to Discord users from your application.

export const HashmarkIcon = props => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M7.75 2a.75.75 0 0 0-.75.75V7H2.75a.75.75 0 0 0-.75.75v1.5c0 .41.34.75.75.75H7v4H2.75a.75.75 0 0 0-.75.75v1.5c0 .41.34.75.75.75H7v4.25c0 .41.34.75.75.75h1.5c.41 0 .75-.34.75-.75V17h4v4.25c0 .41.34.75.75.75h1.5c.41 0 .75-.34.75-.75V17h4.25c.41 0 .75-.34.75-.75v-1.5a.75.75 0 0 0-.75-.75H17v-4h4.25c.41 0 .75-.34.75-.75v-1.5a.75.75 0 0 0-.75-.75H17V2.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V7h-4V2.75A.75.75 0 0 0 9.25 2h-1.5ZM14 14v-4h-4v4h4Z" clip-rule="evenodd" /></svg>;

export const MagicDoorIcon = props => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path fill="currentColor" d="M9 10a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1Z" /><path fill="currentColor" fill-rule="evenodd" d="M13 1a9 9 0 0 1 9 9v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-8a9 9 0 0 1 9-9h2Zm5.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM12 8.22a4 4 0 1 0-8 0v9.5a1 1 0 0 0 1.24.97l5.72-1.43c.6-.15 1.04-.7 1.04-1.34v-7.7Zm5.68.26a.73.73 0 0 0-1.36 0l-.18.48a2 2 0 0 1-1.18 1.18l-.48.18a.73.73 0 0 0 0 1.36l.48.18a2 2 0 0 1 1.18 1.18l.18.48a.73.73 0 0 0 1.36 0l.18-.48a2 2 0 0 1 1.18-1.18l.48-.18a.73.73 0 0 0 0-1.36l-.48-.18a2 2 0 0 1-1.18-1.18l-.18-.48ZM14.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" clip-rule="evenodd" /></svg>;

export const UserIcon = props => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path fill="currentColor" d="M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM11.53 11A9.53 9.53 0 0 0 2 20.53c0 .81.66 1.47 1.47 1.47h.22c.24 0 .44-.17.5-.4.29-1.12.84-2.17 1.32-2.91.14-.21.43-.1.4.15l-.26 2.61c-.02.3.2.55.5.55h11.7a.5.5 0 0 0 .5-.55l-.27-2.6c-.02-.26.27-.37.41-.16.48.74 1.03 1.8 1.32 2.9.06.24.26.41.5.41h.22c.81 0 1.47-.66 1.47-1.47A9.53 9.53 0 0 0 12.47 11h-.94Z" /></svg>;

<Warning>
  This feature is currently available with rate limits.
  To increase the rate limits for your game, please follow
  [Communication Features: Applying for Increased Rate Limits for Production Releases](/developers/discord-social-sdk/core-concepts/communication-features#applying-for-increased-rate-limits-for-production-releases).
</Warning>

## Overview

Direct Messages (DMs) allow players to communicate privately. This guide will show you how to:

* Send text messages between users
* Handle displaying messages in your game
* Retrieve conversation history and summaries

### Prerequisites

Before you begin, make sure you have:

* Set up the Discord Social SDK with our [Getting Started guide](/developers/discord-social-sdk/getting-started)

<Warning>
  To utilize this communication feature, you must enable [`Client::GetDefaultCommunicationScopes`] in your OAuth Scope configuration.
  See the [OAuth Scopes Core Concepts Guide](/developers/discord-social-sdk/core-concepts/oauth2-scopes) for more details.
</Warning>

[`Client::GetDefaultCommunicationScopes`]: https://discord.com/developers/docs/social-sdk/classdiscordpp_1_1Client.html#a71499da752fbdc2d4326ae0fd36c0dd1

### Types of Chat Messages

The Discord Social SDK supports two types of chat:

* [Direct messages (DMs) between two users](/developers/discord-social-sdk/development-guides/sending-direct-messages#sending-a-direct-message-to-a-user)
* [Chat messages within a lobby](/developers/discord-social-sdk/development-guides/managing-lobbies#sending-messages-to-a-lobby)

The SDK receives messages in the following channel types:

* DM
* Ephemeral DM
* Lobby

Let's get started with sending a direct message to another user.

***

## Sending a Direct Message to a User

<Info>
  While the SDK allows you to send messages on behalf of a user, you must only do so in response to a user action. You should never automatically send messages.
</Info>

Here's how to send a direct message. You'll need the recipient's Discord ID and the message you want to send.

```cpp  theme={"system"}
std::string message = "ready to queue?";
uint64_t recipientId = 1234567890; // The recipient's Discord ID

client->SendUserMessage(recipientId, message, [](auto result, uint64_t messageId) {
  if (result.Successful()) {
    std::cout << "✅ Message sent successfully\n";
  } else {
    std::cout << "❌ Failed to send message: " << result.Error() << "\n";
  }
});
```

### Syncing Messages with Discord

In some situations, messages from your game with the Social SDK will also appear in Discord. This will happen for:

* 1 on 1 chat when at least one of the users is a full Discord user
* Lobby chat when the lobby is [linked to a Discord channel](/developers/discord-social-sdk/development-guides/linked-channels)
* The message must have been sent by a user who is not banned on Discord.

When messaging between provisional accounts or non-friends, channel ID and recipient ID is set to the other user's ID. These messages are sent ephemerally and do not persist within a channel. Because of that, you will not be able to resolve a [`ChannelHandle`] for them.

***

## Receiving and Rendering Messages

When a user sends a message, the SDK can respond to new messages by registering [`Client::SetMessageCreatedCallback`]. You can access the message content and sender's ID in your callback from the [`MessageHandle`] object.

The [`MessageHandle`] represents a single message received by the SDK.

```cpp  theme={"system"}
client->SetMessageCreatedCallback([&client](uint64_t messageId) {
  if (auto message = client->GetMessageHandle(messageId)) {
    std::cout << "New message from " << message->AuthorId() << ": " << message->Content() << "\n";
  }
});
```

There are also callbacks for when a message is updated or deleted. Register these callbacks with [`Client::SetMessageUpdatedCallback`] and [`Client::SetMessageDeletedCallback`].

### Suppressing Double Notifications

Suppose the user has the Discord desktop application open on the same machine as the game. In that case, they will hear notifications from the Discord application, even though they can see those messages in-game. So to avoid double-notifying users, you should call [`Client::SetShowingChat`] whenever the chat is shown or hidden to suppress those duplicate notifications.

### Legal Disclosure Message Type

As a convenience for game developers, the first time a user sends a message in the game, that message shows up on the Discord client. The SDK will inject a "fake" message into the chat that contains a basic English explanation of what is happening to the user. You can identify these messages with the [`MessageHandle::DisclosureType`] method. We encourage you to customize the rendering of these messages, possibly changing the wording, translating them, and making them look more "official". You can choose to avoid rendering these as well.

### Message History

The SDK keeps the 25 most recent messages in each channel in memory, including direct messages. For older messages,
see the [Getting Direct Message History](/developers/discord-social-sdk/development-guides/sending-direct-messages#getting-direct-message-history)
section below to retrieve additional history from Discord's servers.

A [`MessageHandle`] will keep working even after the SDK has discarded the message for being too old.
You just won't be able to create new [`MessageHandle`] objects for that message via [`Client::GetMessageHandle`].

### Working with Unrenderable Content

Messages sent on Discord can contain content that may not be renderable in-game, such as images, videos, embeds, polls, and more. The game isn't expected to render these. Instead, it should show a notice so the user knows there is more content and a way to view it on Discord. The [`MessageHandle::AdditionalContent`] method will contain data about the non-text content in this message.

You can use this metadata to render a placeholder message for players and can link out to Discord using [`Client::CanOpenMessageInDiscord`] and [`Client::OpenMessageInDiscord`].

There is also more information about [messages in the Discord API](/developers/resources/message) documentation.

## Getting Direct Message History

The SDK provides two methods to retrieve direct message conversation history, allowing you to display past conversations when users open a DM or browse their message list.

### Retrieving All Conversation Summaries

Use [`Client::GetUserMessageSummaries`] to get a list of all users the current user has DM conversations with, along
with the most recent message ID for each conversation:

```cpp  theme={"system"}
client->GetUserMessageSummaries([](const discordpp::ClientResult &result,
                                  const std::vector<discordpp::UserMessageSummary> &summaries) {
    if (result.Successful()) {
        std::cout << "📋 Retrieved " << summaries.size() << " conversations\n";

        for (const auto &summary : summaries) {
            std::cout << "User ID: " << summary.UserId()
                     << ", Last Message ID: " << summary.LastMessageId() << "\n";
        }
    } else {
        std::cerr << "❌ Failed to retrieve conversation summaries\n";
    }
});
```

This is particularly useful for:

* Building a conversation list UI
* Determining which users have active conversations
* Finding the most recent activity in each conversation

### Retrieving Messages from a Specific Conversation

Use [`Client::GetUserMessagesWithLimit`] to fetch message history from a specific DM conversation:

```cpp  theme={"system"}
const uint64_t recipientId = 1234567890; // The other user's Discord ID
const int32_t messageLimit = 50; // Number of recent messages to retrieve (max 200)

client->GetUserMessagesWithLimit(
    recipientId, messageLimit,
    [](const discordpp::ClientResult &result,
       const std::vector<discordpp::MessageHandle> &messages) {
        if (result.Successful()) {
            std::cout << "💬 Retrieved " << messages.size()
                     << " messages from conversation\n";

            // Messages are returned in reverse chronological order (newest first)
            for (const auto &message : messages) {
                std::cout << "Message: " << message.Content()
                         << " from " << message.AuthorId() << std::endl;
            }
        } else {
            std::cerr << "❌ Failed to retrieve message history\n";
        }
    }
);
```

**Important limitations:**

* Only a maximum of 200 messages and up to 72 hours of history can be retrieved
* Both players must have played the game for DM history to be accessible
* If either user hasn't played the game, the system cannot find a channel between them and may return a 404 `discordpp::ErrorType::HTTPError` error

Key points about [`Client::GetUserMessagesWithLimit`] that are important to note:

* Messages are returned in reverse chronological order (newest first)
* The function checks the local cache first and only makes an HTTP request if needed
* Pass 0 or a negative value for `limit` to retrieve all available messages (up to the 200 message maximum)

This functionality is useful for:

* Displaying conversation history when a user opens a DM
* Implementing message scrollback features
* Preserving conversation context across game sessions
* Building a full-featured in-game messaging interface

## In-Game Direct Message Settings

The Discord client provides a settings screen for users to be able to control who can DM them in-game via the
Social SDK.

<img src="https://mintcdn.com/discord/eiEEruEfypjAPE6V/images/social-sdk/development-guides/discord-game-dm-settings.png?fit=max&auto=format&n=eiEEruEfypjAPE6V&q=85&s=89691c1222c03710fea51d738a660513" alt="Discord content and social - Connected game settings" data-og-width="994" width="994" data-og-height="684" height="684" data-path="images/social-sdk/development-guides/discord-game-dm-settings.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/discord/eiEEruEfypjAPE6V/images/social-sdk/development-guides/discord-game-dm-settings.png?w=280&fit=max&auto=format&n=eiEEruEfypjAPE6V&q=85&s=2c83dd1aeb72107c33e8b40850e22d96 280w, https://mintcdn.com/discord/eiEEruEfypjAPE6V/images/social-sdk/development-guides/discord-game-dm-settings.png?w=560&fit=max&auto=format&n=eiEEruEfypjAPE6V&q=85&s=684c9030d08ea9d5a4803a469d6f1065 560w, https://mintcdn.com/discord/eiEEruEfypjAPE6V/images/social-sdk/development-guides/discord-game-dm-settings.png?w=840&fit=max&auto=format&n=eiEEruEfypjAPE6V&q=85&s=48f423ac529fdcd5b96e481345ca55a3 840w, https://mintcdn.com/discord/eiEEruEfypjAPE6V/images/social-sdk/development-guides/discord-game-dm-settings.png?w=1100&fit=max&auto=format&n=eiEEruEfypjAPE6V&q=85&s=1b50f55a5f3d7910ada38d007458f920 1100w, https://mintcdn.com/discord/eiEEruEfypjAPE6V/images/social-sdk/development-guides/discord-game-dm-settings.png?w=1650&fit=max&auto=format&n=eiEEruEfypjAPE6V&q=85&s=1f5a2753c154cbb1d44114bdf04c4ce4 1650w, https://mintcdn.com/discord/eiEEruEfypjAPE6V/images/social-sdk/development-guides/discord-game-dm-settings.png?w=2500&fit=max&auto=format&n=eiEEruEfypjAPE6V&q=85&s=2901ddb3143ca0dd0a41d4e5353bfdf2 2500w" />

You cannot control these settings directly with the Social SDK. However, you can call
[`Client::OpenConnectedGamesSettingsInDiscord`], which opens the Connected Games settings in the Discord client,
where users can manage their direct messaging settings related to games using the Discord Social SDK.

If the client isn't connected or the user is a provisional account, this function does nothing.

It is always a no-op for console platforms.

***

## Next Steps

Now that you know how to send and receive messages, check out these other Discord Social SDK features:

<CardGroup cols={3}>
  <Card title="Setting Rich Presence" href="/developers/discord-social-sdk/development-guides/setting-rich-presence" icon={<UserIcon />}>
    Display in-game status and activity to friends.
  </Card>

  <Card title="Managing Lobbies" href="/developers/discord-social-sdk/development-guides/managing-lobbies" icon={<MagicDoorIcon />}>
    Bring players together in a shared lobby with invites, text chat, and voice comms.
  </Card>

  <Card title="Linked Channels" href="/developers/discord-social-sdk/development-guides/linked-channels" icon={<HashmarkIcon />}>
    Enable text chat between a Discord channel and your game.
  </Card>
</CardGroup>

Need help? Join the [Discord Developers Server](https://discord.gg/discord-developers) and share questions in the `#social-sdk-dev-help` channel for support from the community.

If you encounter a bug while working with the Social SDK, please report it here:  [https://dis.gd/social-sdk-bug-report](https://dis.gd/social-sdk-bug-report)

***

## Change Log

| Date            | Changes                          |
| --------------- | -------------------------------- |
| August 29, 2025 | Add DM history                   |
| June 30, 2025   | Add communications scope warning |
| May 06, 2025    | link to DM Settings              |
| March 17, 2025  | initial release                  |

[`ChannelHandle`]: https://discord.com/developers/docs/social-sdk/classdiscordpp_1_1ChannelHandle.html#ac32096b2ef15c5c220e9b7b92253cc46

[`Client::CanOpenMessageInDiscord`]: https://discord.com/developers/docs/social-sdk/classdiscordpp_1_1Client.html#ae2aac143a691091691c5cc75aa07dace

[`Client::GetMessageHandle`]: https://discord.com/developers/docs/social-sdk/classdiscordpp_1_1Client.html#a7825220b28952a2156bd0e46db40ea5c

[`Client::GetUserMessageSummaries`]: https://discord.com/developers/docs/social-sdk/classdiscordpp_1_1Client.html#a32dafc20ff1f99b019e40bdc81f46dde

[`Client::GetUserMessagesWithLimit`]: https://discord.com/developers/docs/social-sdk/classdiscordpp_1_1Client.html#a054a758a76c5873b38a4d79651a5f26c

[`Client::OpenConnectedGamesSettingsInDiscord`]: https://discord.com/developers/docs/social-sdk/classdiscordpp_1_1Client.html#a24f268f5eebe9919a3f774354eb577e0

[`Client::OpenMessageInDiscord`]: https://discord.com/developers/docs/social-sdk/classdiscordpp_1_1Client.html#a66b8f85b14403a5d5ea125f39aa6e1b1

[`Client::SetMessageCreatedCallback`]: https://discord.com/developers/docs/social-sdk/classdiscordpp_1_1Client.html#a28325a8e8c688a84ac851da4bc86e148

[`Client::SetMessageDeletedCallback`]: https://discord.com/developers/docs/social-sdk/classdiscordpp_1_1Client.html#a2b6079eded10bea29abbb9695702637b

[`Client::SetMessageUpdatedCallback`]: https://discord.com/developers/docs/social-sdk/classdiscordpp_1_1Client.html#aa01cf3c15403f29780dabfcfaf3b1dcd

[`Client::SetShowingChat`]: https://discord.com/developers/docs/social-sdk/classdiscordpp_1_1Client.html#acdf400ecb926392d1a110da73152b594

[`MessageHandle`]: https://discord.com/developers/docs/social-sdk/classdiscordpp_1_1MessageHandle.html#ae25595b43bc74b0c4c92c5165d16382f

[`MessageHandle::AdditionalContent`]: https://discord.com/developers/docs/social-sdk/classdiscordpp_1_1MessageHandle.html#af4497491a95fda65402b6acf7a8b42e5

[`MessageHandle::DisclosureType`]: https://discord.com/developers/docs/social-sdk/classdiscordpp_1_1MessageHandle.html#abefb9be7836951a6acf78a4bb1676638


Content Publishing
This guide shows you how to publish single images, videos, reels (single media posts), or posts containing multiple images and videos (carousel posts) on Instagram professional accounts using the Instagram Platform.

On March 24, 2025, we introduced the new alt_text field for image posts on the /<INSTAGRAM_PROFESSIONAL_ACCOUNT_ID>/media endpoint. Reels and stories are not supported.

Requirements
This guide assumes you have read the Instagram Platform Overview and implemented the needed components for using this API, such as a Meta login flow and a webhooks server to receive notifications.

Media on a public server
We cURL media used in publishing attempts, so the media must be hosted on a publicly accessible server at the time of the attempt.

Page Publishing Authorization
An Instagram professional account connected to a Page that requires Page Publishing Authorization (PPA) cannot be published to until PPA has been completed.

It's possible that an app user may be able to perform Tasks on a Page that initially does not require PPA but later requires it. In this scenario, the app user would not be able to publish content to their Instagram professional account until completing PPA. Since there's no way for you to determine if an app user's Page requires PPA, we recommend that you advise app users to preemptively complete PPA.

You will need the following:

Instagram API with Instagram Login	Instagram API with Facebook Login
Access Levels

Advanced Access
Standard Access
Advanced Access
Standard Access
Access Tokens

Instagram User access token
Facebook Page access token
Host URL

graph.instagram.com

graph.facebook.com rupload.facebook.com (For resumable video uploads)

Login Type

Business Login for Instagram

Facebook Login for Business

Permissions	
instagram_business_basic
instagram_business_content_publish
instagram_basic
instagram_content_publish
pages_read_engagement
If the app user was granted a role on the Page connected to your app user's Instagram professional account via the Business Manager, your app will also need:

ads_management
ads_read
Webhooks

Endpoints
/<IG_ID>/media — Create media container and upload the media
upload_type=resumable — Create a resumbable upload session to upload large videos from an area with frequent network interruptions or other transmission failures. Only for apps that have implemented Facebook Login for Business.
/<IG_ID>/media_publish — publish uploaded media using their media containers.
/<IG_CONTAINER_ID>?fields=status_code — check media container publishing eligibility and status.
/<IG_ID>/content_publishing_limit — check app user's current publishing rate limit usage.

POST https://rupload.facebook.com/ig-api-upload/<IG_MEDIA_CONTAINER_ID> — Upload the video to Meta servers

GET /<IG_MEDIA_CONTAINER_ID>?fields=status_code — Check publishing eligibility and status of the video

HTML URL encoding troubleshooting
Some of the parameters are supported in list/dict format.
Some characters need to be encoded into a format that can be transmitted over the Internet. For example: user_tags=[{username:’ig_user_name’}] is encoded to user_tags=%5B%7Busername:ig_user_name%7D%5D where [ is encoded to %5B and { is encoded to %7B. For more conversions, please refer to the HTML URL Encoding standard.
Limitations
JPEG is the only image format supported. Extended JPEG formats such as MPO and JPS are not supported.
Shopping tags are not supported.
Branded content tags are not supported.
Filters are not supported.
For additional limitations, see each endpoint's reference.

Rate Limit
Instagram accounts are limited to 100 API-published posts within a 24-hour moving period. Carousels count as a single post. This limit is enforced on the POST /<IG_ID>/media_publish endpoint when attempting to publish a media container. We recommend that your app also enforce the publishing rate limit, especially if your app allows app users to schedule posts to be published in the future.

To check an Instagram professional account's current rate limit usage, query the GET /<IG_ID>/content_publishing_limit endpoint.

Create a container
In order to publish a media object, it must have a container. To create the media container and upload a media file, send a POST request to the /<IG_ID>/media endpoint with the following parameters:

access_token – Set to your app user's access token
image_url or video_url – Set to the path of the image or video. We will cURL your image using the passed in URL so it must be on a public server.
media_type — If the container will be for a video, set to VIDEO, REELS, or STORIES.
is_carousel_item – If the media will be part of a carousel, set to true
upload_type – Set to resumable, if creating a resumable upload session for a large video file
Visit the Instagram User Media Endpoint Reference for additional optional parameters.


Example Request
Formatted for readability.

curl -X POST "https://<HOST_URL>/<LATEST_API_VERSION>/<IG_ID>/media"
     -H "Content-Type: application/json" 
     -H "Authorization: Bearer <ACCESS_TOKEN>" 
     -d '{
           "image_url":"https://www.example.com/images/bronz-fonz.jpg"
         }'
On success, your app receives a JSON response with the Instagram Container ID.

{
  "id": "<IG_CONTAINER_ID>"  
}
Create a carousel container
To publish up to 10 images, videos, or a combination of the two, in a single post, a carousel post, you must create a carousel container. This carousel containter will contain a list of all media containers.

To create the carousel container, send a POST request to the /<IG_ID>/media endpoint with the following parameters:

media_type — Set to CAROUSEL. Indicates that the container is for a carousel.
children — A comma separated list of up to 10 container IDs of each image and video that should appear in the published carousel.

Limitations
Carousels are limited to 10 images, videos, or a mix of the two.
Carousel images are all cropped based on the first image in the carousel, with the default being a 1:1 aspect ratio.
Accounts are limited to 50 published posts within a 24-hour period. Publishing a carousel counts as a single post.
Example Request
Formatted for readability.

curl -X POST "https://graph.instagram.com/v25.0/90010177253934/media"
     -H "Content-Type: application/json" 
     -d '{  
           "caption":"Fruit%20candies"
           "media_type":"CAROUSEL"
           "children":"<IG_CONTAINER_ID_1>,<IG_CONTAINER_ID_2>,<IG_CONTAINER_ID_3>"
         }'
On success, your app receives a JSON response with the Instagram Carousel Container ID.

{
  "id": "<IG_CAROUSEL_CONTAINER_ID>" 
}
Resumable Upload Session
If you created a container for a resumable video upload in Step 1, your need to upload the video before it can be published.

Most API calls use the graph.facebook.com host however, calls to upload videos for Reels use rupload.facebook.com.

The following file sources are supported for uploaded video files:

A file located on your computer
A file hosted on a public facing server, such as a CDN
To start the upload session, send a POST request to the /<IG_MEDIA_CONTAINER_ID endpoint on the rupload.facebook.com host with the following parameters:

access_token
Sample request upload a local video file
With the ig-container-id returned from a resumable upload session call, upload the video.

Be sure the host is rupload.facebook.com.
All media_type shares the same flow to upload the video.
ig-container-id is the ID returned from resumable upload session calls.
access-token is the same one used in previous steps.
offset is set to the first byte being upload, generally 0.
file_size is set to the size of your file in bytes.
Your_file_local_path is set to the file path of your local file, for example, if uploading a file from, the Downloads folder on macOS, the path is @Downloads/example.mov.
curl -X POST "https://rupload.facebook.com/ig-api-upload/<API_VERSION>/<IG_MEDIA_CONTAINER_ID>`" \
     -H "Authorization: OAuth <ACCESS_TOKEN>" \
     -H "offset: 0" \
     -H "file_size: Your_file_size_in_bytes" \
     --data-binary "@my_video_file.mp4"
Sample request upload a public hosted video
curl -X POST "https://rupload.facebook.com/ig-api-upload/<API_VERSION>/<IG_MEDIA_CONTAINER_ID>`" \
     -H "Authorization: OAuth <ACCESS_TOKEN>" \
     -H "file_url: https://example_hosted_video.com"
Sample Response
// Success Response Message
{
  "success":true,
  "message":"Upload successful."
}

// Failure Response Message
{
  "debug_info":{
    "retriable":false,
    "type":"ProcessingFailedError",
    "message":"{\"success\":false,\"error\":{\"message\":\"unauthorized user request\"}}"
  }
}
Publish the container
To publish the media,

Send a POST request to the /<IG_ID>/media_publish endpoint with the following parameters:

creation_id set to the container ID, either for a single media container or a carousel container
Example Request
Formatted for readability.

    
curl -X POST "https://<HOST_URL>/<LATEST_API_VERSION>/<IG_ID>/media_publish"
     -H "Content-Type: application/json" 
     -H "Authorization: Bearer <ACCESS_TOKEN>"     
     -d '{
           "creation_id":"<IG_CONTAINER_ID>" 
         }'
On success, your app receives a JSON response with the Instagram Media ID.

{
  "id": "<IG_MEDIA_ID>"
}
Reels posts
Reels are short-form videos that appears in the Reels tab of the Instagram app. To publish a reel, create a container for the video and include the media_type=REELS parameter along with the path to the video using the video_url parameter.

If you publish a reel and then request its media_type field, the value returned is VIDEO. To determine if a published video has been designated as a reel, request its media_product_type field instead.

You can use the code sample on GitHub (insta_reels_publishing_api_sample) to learn how to publish Reels to Instagram.

Trial Reels posts
Trial reels are reels that are only shared to non-followers. To publish a trial reel, create a container for the video and include a valid trial_params parameter along with the parameters required to create reels. trial_params consists of the following fields:

Field Name	Description
graduation_strategy

The graduation strategy specifies the conditions to graduate a reel (convert the trial reel to a reel, sharing it to followers). Possible values:

MANUAL — The trial reel can be manually graduated in the native app.
SS_PERFORMANCE — The trial reel will be automatically graduated if the trial reel performs well.
Example Request
Formatted for readability.

curl -X POST "https://graph.instagram.com/v25.0/90010177253934/media"
     -H "Content-Type: application/json" 
     -d '{  
           "media_type":"REELS"
           "video_url":"https://www.example.com/videos/bronz-fonz.mp4"
           "trial_params":{
             “graduation_strategy”: “MANUAL”
           }
         }'
Story posts
To publish a reel, create a container for the media object and include the media_type parameter set to STORIES.

If you publish a story and then request its media_type field, the value will be returned as IMAGE/VIDEO. To determine if a published image/video is a story, request its media_product_type field instead.

Troubleshooting
If you are able to create a container for a video but the POST /<IG_ID>/media_publish endpoint does not return the published media ID, you can get the container's publishing status by querying the GET /<IG_CONTAINER_ID>?fields=status_code endpoint. This endpoint will return one of the following:

EXPIRED — The container was not published within 24 hours and has expired.
ERROR — The container failed to complete the publishing process.
FINISHED — The container and its media object are ready to be published.
IN_PROGRESS — The container is still in the publishing process.
PUBLISHED — The container's media object has been published.
We recommend querying a container's status once per minute, for no more than 5 minutes.

Errors
See the Error Codes reference.

Next Steps
Now that you have published to an Instagram professional account, learn how to moderate comments on your media.

Reference
The Instagram (IG) Platform consists of nodes (objects), edges (collections) on those nodes, and fields (object properties). Nodes and Root Edges (edges that are not on a node) are listed below. API requests are sent to one of two Meta host URLs.

Host URL	Login type
graph.facebook.com

Instagram API with Facebook Login

graph.instagram.com

Instagram API with Instagram Login

Nodes
Node	Description
IG Comment

Represents an Instagram comment

IG Container

Represents a media container for publishing an Instagram media object.

IG Hashtag

Represents an Instagram hashtag. Only available for Instagram API with Facebook Login.

IG Media

Represents an Instagram photo, video, story, or album.

IG User

Represents an Instagram Business Account or Instagram Creator Account.

Page

Represents a Facebook Page. Only available for Instagram API with Facebook Login.

Root Edges
Root Edge	Actions
ig_hashtag_search

Gets the ID of an IG Hashtag. Only available for Instagram API with Facebook Login.

facebook sdk : 
<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '{your-app-id}',
      cookie     : true,
      xfbml      : true,
      version    : '{api-version}'
    });
      
    FB.AppEvents.logPageView();   
      
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script>

The first step when loading your web page is figuring out if a person is already logged into your app with Facebook login. You start that process with a call to FB.getLoginStatus. That function will trigger a call to Facebook to get the login status and call your callback function with the results.
Taken from the sample code above, here's some of the code that's run during page load to check a person's login status:
FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
});
Copy code
The response object that's provided to your callback contains a number of fields:
{
    status: 'connected',
    authResponse: {
        accessToken: '...',
        expiresIn:'...',
        signedRequest:'...',
        userID:'...'
    }
}
Copy code
status specifies the login status of the person using the app. The status can be one of the following:
connected - the person is logged into Facebook, and has logged into your app.
not_authorized - the person is logged into Facebook, but has not logged into your app.
unknown - the person is not logged into Facebook, so you don't know if they've logged into your app or FB.logout() was called before and therefore, it cannot connect to Facebook.
authResponse is included if the status is connected and is made up of the following:
accessToken - contains an access token for the person using the app.
expiresIn - indicates the UNIX time when the token expires and needs to be renewed.
signedRequest - a signed parameter that contains information about the person using the app.
userID - the ID of the person using the app.
Once your app knows the login status of the person using it, it can do one of the following:
If the person is logged into Facebook and your app, redirect them to your app's logged in experience.
If the person isn't logged into your app, or isn't logged into Facebook, prompt them with the Login dialog with FB.login() or show them the Login Button.


Access Token
The /access_token endpoint allows you to exchange short-lived Instagram User Access Tokens, those that expire in one hour, for long-lived Instagram User access Tokens that expire in 60 days.

Creating
This operation is not supported.

Reading
GET /access_token

Exchange a short-lived Instagram User access token, that expires in one hour, for long-lived Instagram User access token that expires in 60 days.

Limitations
Requests for long-lived tokens include your app secret so should only be made in server-side code, never in client-side code or in an app binary that could be decompiled. Do not share your app secret with anyone, expose it in code, send it to a client, or store it in a device.

Requirements
Access tokens
An Instagram User access token requested from a person who can send a message from the Instagram professional account
Base URL
All endpoints can be accessed via the graph.instagram.com host.

Endpoints
/access_token
Required Parameters
The following table contains the required parameters for each API request.

Key	Value
client_secret
Required
String

Your Instagram app's secret, displayed in the App Dashboard > Products > Instagram > Basic Display > Instagram App Secret field.

grant_type
Required
String

Set this to ig_exchange_token

access_token
Required
String

The valid (unexpired) short-lived Instagram User Access Token that you want to exchange for a long-lived token.

Permissions
instagram_graph_user_profile for Instagram Basic Display API
Request Syntax
Formatted for readability.

GET https://graph.instagram.com/access_token
  ?grant_type=ig_exchange_token
  &client_secret=<INSTAGRAM_APP_SECRET>
  &access_token=<VALID_SHORT_LIVED_ACCESS_TOKEN>
Response
Upon success, your app receives a JSON-formatted object containing the following:

access_token set to the new, long-lived Instagram User access token; numeric string
token_type set to bearer; string
expires_in set to the number of seconds until the token expires; integer
cURL Example
Request
curl -X GET "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&&client_secret=eb87G...&access_token=IGQVJ..."
Response
{
  "access_token": "lZAfb2dhVW...",
  "token_type": "bearer",
  "expires_in": 5184000
}


Docs
Overview
About the WhatsApp Business Platform
About the WhatsApp Business Platform
Updated: Dec 5, 2025
The WhatsApp Business Platform enables businesses to communicate with customers at scale.
This documentation is intended for developers using our APIs. If you are looking for information on other ways to use WhatsApp for your business see the WhatsApp Business site⁠.
Core APIs and capabilities
WhatsApp Cloud API
WhatsApp Cloud API enables you to programmatically message and call on WhatsApp. You can use Cloud API to send users a variety of messages, from simple text messages to rich media and interactive messages.
WhatsApp Cloud API includes:
Messaging: Send text messages, rich media, and interactive messages
Calling: Make and receive calls to customers
Groups: Create, manage, and message WhatsApp group conversations
WhatsApp messaging provides a powerful and private way to engage with customers. Use Cloud API to:
Send order confirmations and shipping updates
Share appointment availability and other reminders
Drive upsell and cross-sell opportunities
Facilitate end-to-end transactions, from product discovery to payment
Enable multi-factor authentication or one-time passwords to verify accounts and users
Deliver custom interactive conversational experiences
Learn more about message types on WhatsApp Cloud API.
Business Management API
The WhatsApp Business Management API enables you to programmatically manage a WhatsApp Business Account and its associated assets.
Manage account assets with Business Management API like:
Business phone numbers: Add and remove phone numbers associated with your business
Templates: Create and modify message templates for scalable messaging.
Business Management API also gives you access to account analytics like:
Messaging analytics: The number and type of messages sent and delivered.
Pricing analytics: Granular pricing breakdowns for delivered messages.
Template analytics: Sent/read/delivered template metrics, alongside template message button clicks.
Learn more about message templates.
Learn more about managing business phone numbers.
Learn more about account analytics.
Marketing Messages API for WhatsApp
MM API for WhatsApp is an API for sending optimized marketing messages on WhatsApp.
When you send marketing messages through the MM API for WhatsApp, you can access new features not available on Cloud API and get automatic optimizations, so high engagement messages can reach more customers.
The MM API for WhatsApp includes:
Quality-based delivery: Up to 9% higher marketing message deliveries over Cloud API for high engagement content.
Automated creative optimizations: Automatic enhancements to marketing creative to increase message performance.
Performance benchmarks and recommendations: Comparison of read and click rates versus similar templates from businesses in your region.
Conversion metrics: Measure marketing messages that lead users to perform app events such as ‘Add to Cart’, ‘Checkout Initiated’, or ‘Purchase’.
Learn more about the Marketing Messages API for WhatsApp.
Webhooks
Webhooks deliver JSON payloads to your server for message status updates, incoming messages, asynchronous error handling, and many other notification utilities.
The platform relies heavily on webhooks, as the contents of any message sent from a WhatsApp user to your business phone number is communicated via webhook, and all outgoing message delivery status updates are reported via webhook.
Learn more about webhooks.
Technical foundations
HTTP protocol and API requests
The WhatsApp Business Platform is built on Graph API and uses HTTP protocol. API requests include path, body, and header parameters.
Example: Sending a text message using cURL
curl 'https://graph.facebook.com/v17.0/106540352242922/messages' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer EAAJB...' \
  -d '{
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "+16505555555",
    "type": "text",
    "text": {
      "preview_url": true,
      "body": "Here's the info you requested! https://www.meta.com/quest/quest-3/"
    }
  }'

Learn more about the Graph API.
JSON responses
API responses are formatted in JSON.
Example: Requesting a business phone number’s metadata
{
  "verified_name": "Lucky Shrub",
  "code_verification_status": "VERIFIED",
  "display_phone_number": "15550783881",
  "quality_rating": "GREEN",
  "platform_type": "CLOUD_API",
  "throughput": {
    "level": "STANDARD"
  },
  "webhook_configuration": {
    "application": "https://www.luckyshrub.com/webhooks"
  },
  "id": "106540352242922"
}

Authentication and authorization
Authentication uses OAuth (not 2.0) access tokens, while permissions restrict access to specific resources.
Learn more about access tokens.
Learn more about permissions.
Key resources
Business portfolios
A business portfolio allows organizations to bring all their Meta business assets together so they can be managed in one place. On the WhatsApp Business Platform, a business portfolio mainly serves as a container for WhatsApp Business Accounts (WABA). You must have a business portfolio to use the platform.
Business portfolios can be verified, and verification status factors into improved functionality, such as higher throughput and Official Business Account status.
Learn more about business portfolios.⁠
WhatsApp business accounts (WABA)
A WhatsApp Business Account represents your business, storing metadata and linking to phone numbers, templates, and analytics.
Learn more about WhatsApp Business Accounts.
Business phone numbers
Business phone numbers, real or virtual, are used for sending and receiving WhatsApp messages. They can have display names and earn Official Business Account status.
Learn more about business phone numbers.
Message templates
Templates are customizable messages that you can construct in advance of sending them. Template messages generally require approval before you can send them.
Templates are useful for messaging at scale. They are also the only type of message that can be sent to WhatsApp users outside of a customer service window.
Templates have quality scores and are subject to various messaging limits.
Learn more about message templates.
Test resources
When you get started with Cloud API, a test WABA and test business phone number are automatically created for you. Test WABAs and test phone numbers are useful for testing purposes, as they have relaxed messaging limits and don’t require a payment method on file in order to send template messages.
You can delete your business portfolio and its test resources if:
You are an admin on the business portfolio associated with the app
No other apps are associated with the business portfolio
The business portfolio is not associated with any other WABAs
The WABA is not associated with any other business phone numbers.
To delete your business portfolio and its test resources:
Go to the App Dashboard > WhatsApp > Configuration panel.
Locate the Test Account section.
Click the Delete button.
We recommend using our API Playground when testing endpoints. You can find the playground in the “API Reference” section on the left sidebar of this page. In each reference, there is a “Try it” button which opens the playground.
Also helpful for testing is our Postman collection⁠.
Tools and integrations
WhatsApp Manager
WhatsApp Manager is a web app for managing WABAs, phone numbers, templates, and reviewing analytics.
Access WhatsApp Manager⁠
Third-party SDKs
Some SDKs, like PyWa⁠ (Python wrapper), are available but are not maintained or endorsed by Meta.
Postman collection
The official Postman collection lets you execute common API queries.
Access the WhatsApp Business Platform Postman collection⁠.
Security and performance
Throughput
Business phone numbers can send up to 80 messages per second by default, with capacity upgrades available.
Learn more about throughput.
Encryption
With the Cloud API, every WhatsApp message continues to be protected by Signal protocol encryption that secures messages before they leave the device. This means messages with a WABA are securely delivered to the destination chosen by each business.
The Cloud API uses industry standard encryption techniques to protect data in transit and at rest. The API uses Graph API for sending messages and Webhooks for receiving events, and both operate over industry standard HTTPS, protected by TLS. See our Encryption Overview whitepaper for additional details.
See the WhatsApp Encryption Overview whitepaper⁠ for additional details.
Scaling
The Cloud API automatically scales usage within your rate limits.
Rate limits
Requests made by your app on your WhatsApp Business Account (WABA) are counted against your app’s request count. An app’s request count is the number of requests it can make during a rolling one hour.
For the following endpoints, your app can make 200 requests per hour, per app, per WABA, by default. For active WABAs with at least one registered phone number, your app can make 5000 requests per hour, per app, per active WABA.
Type of request	Endpoint
GET
/<WHATSAPP_BUSINESS_ACCOUNT_ID>
GET, POST, and DELETE
/<WHATSAPP_BUSINESS_ACCOUNT_ID>/assigned_users
GET
/<WHATSAPP_BUSINESS_ACCOUNT_ID>/phone_numbers
GET, POST, and DELETE
/<WHATSAPP_BUSINESS_ACCOUNT_ID>/message_templates
GET, POST, and DELETE
/<WHATSAPP_BUSINESS_ACCOUNT_ID>/subscribed_apps
GET
/<WHATSAPP_BUSINESS_ACCOUNT_TO_NUMBER_CURRENT_STATUS_ID>
For the following Credit Line API requests, your app can make 5000 requests per hour.
Type of request	Endpoint
GET
/<BUSINESS_ID>/extendedcredits
POST
/<EXTENDED_CREDIT_ID>/whatsapp_credit_sharing_and_attach
GET and DELETE
/<ALLOCATION_CONFIG_ID>
GET
/<EXTENDED_CREDIT_ID>/owning_credit_allocation_configs
For more information on how to get your current rate usage, see Headers.
In addition, the platform applies several message rate limits:
Test message rate limit (for unverified WABAs)
Quality rating and messaging limits (for verified WABAs)
Capacity rate limit (for all accounts)
Business phone rate limit (per phone number)
Pair rate limits
Business phone numbers can send 1 message every 6 seconds to the same WhatsApp user (0.17 messages/second), which equals about 10 messages per minute or 600 per hour. Exceeding this limit triggers error code 131056 until you are back within the allowed rate.
You may send up to 45 messages in a 6-second burst, but this “borrows” from your future quota. After a burst, you must wait the equivalent time it would take to send those messages at the normal rate (e.g., a burst of 20 requires a ~2-minute wait before sending more to that user).
To manage post-burst throttling, if a send request fails, retry after 4^X seconds (starting with X=0 and increasing X by 1 after each failure) until successful.
Terms and policies
User opt-in
You must obtain user opt-in before sending message templates. Opt-in must clarify your business name and intent.
Learn more about the WhatsApp Business Messaging Policy.⁠
Terms and policies
All platform use must comply with WhatsApp’s terms and policies. Using unauthorized third-party tools is prohibited.
Learn more about terms and policies.⁠
Next steps
Get started with the WhatsApp Business Platform.
Learn more
Display names
Phone numbers
Pricing
Webhooks

https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started


---
layout: Conceptual
title: Getting Access to LinkedIn APIs - LinkedIn | Microsoft Learn
canonicalUrl: https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access
breadcrumb_path: /linkedin/breadcrumb/toc.json
recommendations: false
feedback_system: Standard
feedback_product_url: https://linkedin.zendesk.com/hc/en-us
uhfHeaderId: MSDocsHeader-LinkedIn
ms.subservice: shared
description: Overview of LinkedIn's available OAuth permissions and how to request them.
author: Deeksha-ramesh
ms.author: li_dramesh
ms.date: 2025-06-24T00:00:00.0000000Z
ms.topic: article
ms.service: linkedin
locale: en-us
document_id: 889d08d6-639b-aa5f-5fe7-51cc2d890f2e
document_version_independent_id: ac9bfea7-66e6-9071-d313-8764e5878153
updated_at: 2026-02-18T07:08:00.0000000Z
original_content_git_url: https://github.com/MicrosoftDocs/linkedin-api-docs/blob/live/linkedin-api-docs/shared/authentication/getting-access.md
gitcommit: https://github.com/MicrosoftDocs/linkedin-api-docs/blob/30424f24bb99b2e59624c5a365229466de55bdd8/linkedin-api-docs/shared/authentication/getting-access.md
git_commit_id: 30424f24bb99b2e59624c5a365229466de55bdd8
site_name: Docs
depot_name: MSDN.linkedin-api-docs
page_type: conceptual
toc_rel: ../../toc.json
feedback_help_link_type: ''
feedback_help_link_url: ''
word_count: 500
asset_id: shared/authentication/getting-access
moniker_range_name: 
monikers: []
item_type: Content
source_path: linkedin-api-docs/shared/authentication/getting-access.md
cmProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/aec7dc3e-0dad-4b82-accf-63218d8767d5
spProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/f260444a-7ec6-4768-8e41-ad2438092724
platformId: f936e9b6-72c2-24b8-509b-6ff3b20a4c63
---

# Getting Access to LinkedIn APIs - LinkedIn | Microsoft Learn

The LinkedIn API uses [OAuth 2.0](http://oauth.net/2/) for user authorization and API authentication. Applications must be authorized and authenticated before they can fetch data from LinkedIn or get access to member data. This page summarizes the available permissions and partner programs available for accessing LinkedIn APIs. Most permissions and partner programs require explicit approval from LinkedIn. Open Permissions are the only permissions that are available to all developers without special approval.

All permissions listed below are used in either [Member Authentication Flow](authorization-code-flow) (3-legged) or [Application Authentication Flow](client-credentials-flow) (2-legged). More about these permission types can be found in [Authenticating with OAuth 2.0 Overview](authentication).

## Open Permissions (Consumer)

The following permissions are available to all developers, and may be added via self-service through the LinkedIn [Developer Portal](https://www.linkedin.com/developers/), under the Products tab on your application page. LinkedIn products can be enabled after creating a new application.

| Product/Program | Permission | Description |
| --- | --- | --- |
| Sign in with LinkedIn using OpenID Connect | profile | **Member Auth**: Retrieve authenticated member's name, headline, and photo. |
| Sign in with LinkedIn using OpenID Connect | email | **Member Auth**: Retrieve authenticated member's primary email address. |
| Share on LinkedIn | w\_member\_social | **Member Auth**: Post, comment and like posts on behalf of an authenticated member. |

## Learning

Developers seeking to build a learning related integration should refer to the [Request API Access](../../learning/getting-started/request-access) page within the LinkedIn Learning API space.

## Marketing

Developers seeking to build a marketing related integration using Advertising API permissions must be approved. You can apply for access through the [Developer Portal](https://www.linkedin.com/developers/). To do this, select your app from [My Apps](https://www.linkedin.com/developers/apps), navigate to the Products tab, and add the Advertising API product. More information of LinkedIn Marketing Partners [here](https://business.linkedin.com/marketing-solutions/marketing-partners).

![MDP](../../media/updated.png)

Audiences permissions may be applied for after becoming an approved Advertising API partner. Contact support or your partner representative for application information.

For the most up-to-date list of available permissions and their descriptions, see the [LinkedIn Marketing API Permissions Table](../../marketing/increasing-access#what-permissions-are-available).

## Sales

Developers seeking to build sales related integration using one of the permissions below must be approved as a Sales Navigator Application Platform (SNAP) partner. [Apply here](https://business.linkedin.com/sales-solutions/partners/become-a-partner) to be a SNAP partner.

| Product/Program | Permission | Description |
| --- | --- | --- |
| Sales Navigator Application Platform(SNAP) | r\_sales\_nav\_analytics | **Member Auth**: Enables access to Sales Navigator Analytics retrieval. |
| Sales Navigator Application Platform(SNAP) | r\_sales\_nav\_display | **Member Auth**: Display Services permission for Sales Navigator. |
| Sales Navigator Application Platform(SNAP) | r\_sales\_nav\_validation | **Application Auth**: Access Sales Navigator endpoints for CRM data validation. |
| Sales Navigator Application Platform(SNAP) | r\_sales\_nav\_profiles | **Application Auth**: Access Sales Navigator endpoints that present matched, publicly available member profile information. |

## Talent

Developers seeking to build talent related integrations through one of the programs listed below can [apply here](https://business.linkedin.com/talent-solutions/ats-partners/partner-application). We recommend familiarizing yourself with the types of partner integrations available before applying by visiting [here](https://business.linkedin.com/talent-solutions/ats-partners#all) and [here](https://business.linkedin.com/talent-solutions/talent-hub/integrations#all).

- [Recruiter System Connect (RSC)](../../talent/recruiter-system-connect)
- [Apply Connect](../../talent/apply-connect)
- [Apply with LinkedIn](../../talent/apply-with-linkedin/apply-with-linkedin)
- [Premium Job Posting](../../talent/premium-job-posting)

## Compliance (Closed)

The following permissions used for Compliance integrations are listed for reference purposes only. Access is closed and may not be requested.

| Product/Program | Permission | Description |
| --- | --- | --- |
| Compliance | r\_compliance | **Member Auth**: Retrieve activities for compliance monitoring and archiving |
| Compliance | w\_compliance | **Member Auth**: Manage and delete data for compliance. |



produnt huunt stuff : 
My Applications
Did you know Product Hunt has an API? Several awesome folks have used it to build things and you can too. Take a look at the API docs and to get started, add your first application:

Add an application

Resurgo
Redirect URI: https://resurgo.life/

API Key: UGiZT_DoOzn3dV32hzdpHj6SomS3UMjweI2cax8Q0qs

API Secret: XwRPmvZ0isK_fK8oatjX9MtsQgV2wjBWndJ796PGDHY

Edit Delete

Developer Token
Please do not share your developer tokens with any untrusted sources.

Token: y3HV3tjC0ivjOyBdy70sW3riVWma3USdJgKS1TlWymg
User Context: Shayan
Expires: Never

Reddit api inofo: 
API methodsby sectionby oauth scope
account
/api/v1/me
/api/v1/me/blocked
/api/v1/me/friends
/api/v1/me/karma
/api/v1/me/prefs
/api/v1/me/trophies
/prefs/blocked
/prefs/friends
/prefs/messaging
/prefs/trusted
/prefs/where
announcements
/api/announcements/v1
/api/announcements/v1/hide
/api/announcements/v1/read
/api/announcements/v1/read_all
/api/announcements/v1/unread
captcha
/api/needs_captcha
emoji
/api/v1/subreddit/emoji.json
/api/v1/subreddit/emoji/emoji_name
/api/v1/subreddit/emoji_asset_upload_s3.json
/api/v1/subreddit/emoji_custom_size
/api/v1/subreddit/emojis/all
flair
/api/clearflairtemplates
/api/deleteflair
/api/deleteflairtemplate
/api/flair
/api/flair_template_order
/api/flairconfig
/api/flaircsv
/api/flairlist
/api/flairselector
/api/flairtemplate
/api/flairtemplate_v2
/api/link_flair
/api/link_flair_v2
/api/selectflair
/api/setflairenabled
/api/user_flair
/api/user_flair_v2
links & comments
/api/comment
/api/del
/api/editusertext
/api/follow_post
/api/hide
/api/info
/api/lock
/api/marknsfw
/api/morechildren
/api/report
/api/save
/api/saved_categories
/api/sendreplies
/api/set_contest_mode
/api/set_subreddit_sticky
/api/set_suggested_sort
/api/spoiler
/api/store_visits
/api/submit
/api/unhide
/api/unlock
/api/unmarknsfw
/api/unsave
/api/unspoiler
/api/vote
listings
/best
/by_id/names
/comments/article
/controversial
/duplicates/article
/hot
/new
/rising
/top
/sort
live threads
/api/live/by_id/names
/api/live/create
/api/live/happening_now
/api/live/thread/accept_contributor_invite
/api/live/thread/close_thread
/api/live/thread/delete_update
/api/live/thread/edit
/api/live/thread/hide_discussion
/api/live/thread/invite_contributor
/api/live/thread/leave_contributor
/api/live/thread/report
/api/live/thread/rm_contributor
/api/live/thread/rm_contributor_invite
/api/live/thread/set_contributor_permissions
/api/live/thread/strike_update
/api/live/thread/unhide_discussion
/api/live/thread/update
/live/thread
/live/thread/about
/live/thread/contributors
/live/thread/discussions
/live/thread/updates/update_id
private messages
/api/compose
/api/del_msg
/api/read_all_messages
/api/read_message
/message/inbox
/message/sent
/message/unread
/message/where
misc
/api/v1/scopes
moderation
/about/edited
/about/log
/about/modqueue
/about/reports
/about/spam
/about/unmoderated
/about/location
/api/accept_moderator_invite
/api/approve
/api/distinguish
/api/ignore_reports
/api/leavecontributor
/api/leavemoderator
/api/remove
/api/show_comment
/api/snooze_reports
/api/unignore_reports
/api/unsnooze_reports
/api/update_crowd_control_level
/stylesheet
new modmail
/api/mod/bulk_read
/api/mod/conversations
/api/mod/conversations/:conversation_id
/api/mod/conversations/:conversation_id/approve
/api/mod/conversations/:conversation_id/archive
/api/mod/conversations/:conversation_id/disapprove
/api/mod/conversations/:conversation_id/highlight
/api/mod/conversations/:conversation_id/mute
/api/mod/conversations/:conversation_id/temp_ban
/api/mod/conversations/:conversation_id/unarchive
/api/mod/conversations/:conversation_id/unban
/api/mod/conversations/:conversation_id/unmute
/api/mod/conversations/read
/api/mod/conversations/subreddits
/api/mod/conversations/unread
/api/mod/conversations/unread/count
modnote
/api/mod/notes
/api/mod/notes/recent
multis
/api/filter/filterpath
/api/filter/filterpath/r/srname
/api/multi/copy
/api/multi/mine
/api/multi/user/username
/api/multi/multipath
/api/multi/multipath/description
/api/multi/multipath/r/srname
search
/search
subreddits
/about/banned
/about/contributors
/about/moderators
/about/muted
/about/wikibanned
/about/wikicontributors
/about/where
/api/delete_sr_banner
/api/delete_sr_header
/api/delete_sr_icon
/api/delete_sr_img
/api/recommend/sr/srnames
/api/search_reddit_names
/api/search_subreddits
/api/site_admin
/api/submit_text
/api/subreddit_autocomplete
/api/subreddit_autocomplete_v2
/api/subreddit_stylesheet
/api/subscribe
/api/upload_sr_img
/api/v1/subreddit/post_requirements
/r/subreddit/about
/r/subreddit/about/edit
/r/subreddit/about/rules
/r/subreddit/about/traffic
/sidebar
/sticky
/subreddits/default
/subreddits/gold
/subreddits/mine/contributor
/subreddits/mine/moderator
/subreddits/mine/streams
/subreddits/mine/subscriber
/subreddits/mine/where
/subreddits/new
/subreddits/popular
/subreddits/search
/subreddits/where
/users/new
/users/popular
/users/search
/users/where
users
/api/block_user
/api/friend
/api/report_user
/api/setpermissions
/api/unfriend
/api/user_data_by_account_ids
/api/username_available
/api/v1/me/friends/username
/api/v1/user/username/trophies
/user/username/about
/user/username/comments
/user/username/downvoted
/user/username/gilded
/user/username/hidden
/user/username/overview
/user/username/saved
/user/username/submitted
/user/username/upvoted
/user/username/where
widgets
/api/widget
/api/widget/widget_id
/api/widget_image_upload_s3
/api/widget_order/section
/api/widgets
wiki
/api/wiki/alloweditor/add
/api/wiki/alloweditor/del
/api/wiki/alloweditor/act
/api/wiki/edit
/api/wiki/hide
/api/wiki/revert
/wiki/discussions/page
/wiki/pages
/wiki/revisions
/wiki/revisions/page
/wiki/settings/page
/wiki/page



instagram stuff : Welcome to the Instagram API
Begin using the Instagram API to create, publish, and manage content. You can also interact with users by sending and receiving messages, as well as moderating comments. Learn more
If you want to be able to track hashtags and insights, switch to the API setup with Facebook login.
Instagram app name
Resurgo-IG
Instagram app ID
26569446812652780
Instagram app secret
Instagram app secret
699b2251ef079f1cb0d66575bdd2650e
1. Add required messaging permissions
Add the listed content management and messaging permissions to create, publish and manage content and respond directly to messages and send private replies with your Instagram account. Manage these and optional permissions and features on the Permissions and features page.
instagram_business_basic
instagram_manage_comments
instagram_business_manage_messages



resurgo facebook token : IGAF5kxWcllOxBZAGEtWl9wQk1EYmVCUXZAkTjJiWHBOV2hnaEptbGQxQ0tTbmhzcmpOT1A2SENIa1FMeEhObFBibXFNSG4wbUg4MmZAqeFNQdlBNY1JmdlJJM25VZAEpnOEtNUkRrYnNVTHdjcUg2aHB4c3ZAQZAGJlX1hlRjVkYWczRQZDZD


telegram gateway api : AAFkOQAAMakqQA-Ln7h3USRr93e1-Xigd2Nj6X4WH1Xfgg
Telegram Gateway API
The Gateway API is an HTTP-based interface created for developers looking to deliver automated messages, such as verification codes, to users who registered their phone number on Telegram.

This page outlines the full API documentation for developers. For more information on the API and the features it offers, see our Verification Platform Overview and Gateway API Tutorial.

Recent changes
February 26, 2025
Updated the possible values for ttl in sendVerificationMessage. The supported range is now 30 to 3600 seconds.
Clarified the behavior of ttl:
If a message is not delivered within the specified ttl, the request fee will be refunded automatically.
If a message is successfully delivered within the ttl, it will not be refunded.
If you were already using ttl before this update, you do not need to change anything to receive refunds.
Updated revokeVerificationMessage to specify that a message will not be removed if it has already been delivered or read.
Added the optional field is_refunded to RequestStatus, which indicates whether the request fee was refunded.
Added new possible statuses delivered and expired to the field status in DeliveryStatus.
Making requests
All queries to the Telegram Gateway API must be served over HTTPS and need to be presented in this form: https://gatewayapi.telegram.org/METHOD_NAME. Like this for example:

https://gatewayapi.telegram.org/sendVerificationMessage
We support GET and POST HTTP methods. We support three ways of passing parameters in Gateway API requests:

URL query string
application/x-www-form-urlencoded
application/json
The response contains a JSON object, which always has a Boolean field ok. If ok equals true, the request was successful, and the result of the query can be found in the result field. In case of an unsuccessful request, ok equals false, and the error is explained in the error field (e.g. ACCESS_TOKEN_INVALID).

All methods in the Gateway API are case-insensitive.
All queries must be made using UTF-8.
Authorization
Before invoking API methods, you must obtain an access token in the Telegram Gateway account settings.

The token must be passed in every request in one of two ways:

in the HTTP header: Authorization: Bearer <token>
as the access_token parameter.
Available methods
We support GET and POST HTTP methods. Use either URL query string or application/json or application/x-www-form-urlencoded for passing parameters in Telegram Gateway API requests.
On successful call, a JSON object containing the result will be returned.

sendVerificationMessage
Use this method to send a verification message. Charges will apply according to the pricing plan for each successful message delivery. Note that this method is always free of charge when used to send codes to your own phone number. On success, returns a RequestStatus object.

See the tutorial for examples >

Parameter	Type	Required	Description
phone_number	String	Yes	The phone number to which you want to send a verification message, in the E.164 format.
request_id	String	Optional	The unique identifier of a previous request from checkSendAbility. If provided, this request will be free of charge.
sender_username	String	Optional	Username of the Telegram channel from which the code will be sent. The specified channel, if any, must be verified and owned by the same account who owns the Gateway API token.
code	String	Optional	The verification code. Use this parameter if you want to set the verification code yourself. Only fully numeric strings between 4 and 8 characters in length are supported. If this parameter is set, code_length is ignored.
code_length	Integer	Optional	The length of the verification code if Telegram needs to generate it for you. Supported values are from 4 to 8. This is only relevant if you are not using the code parameter to set your own code. Use the checkVerificationStatus method with the code parameter to verify the code entered by the user.
callback_url	String	Optional	An HTTPS URL where you want to receive delivery reports related to the sent message, 0-256 bytes.
payload	String	Optional	Custom payload, 0-128 bytes. This will not be displayed to the user, use it for your internal processes.
ttl	Integer	Optional	Time-to-live (in seconds) before the message expires. If the message is not delivered or read within this time, the request fee will be refunded. Supported values are from 30 to 3600.
checkSendAbility
Use this method to optionally check the ability to send a verification message to the specified phone number. If the ability to send is confirmed, a fee will apply according to the pricing plan. After checking, you can send a verification message using the sendVerificationMessage method, providing the request_id from this response.

Within the scope of a request_id, only one fee can be charged. Calling sendVerificationMessage once with the returned request_id will be free of charge, while repeated calls will result in an error. Conversely, calls that don't include a request_id will spawn new requests and incur the respective fees accordingly. Note that this method is always free of charge when used to send codes to your own phone number.

In case the message can be sent, returns a RequestStatus object. Otherwise, an appropriate error will be returned.

See the tutorial for examples >

Parameter	Type	Required	Description
phone_number	String	Yes	The phone number for which you want to check our ability to send a verification message, in the E.164 format.
checkVerificationStatus
Use this method to check the status of a verification message that was sent previously. If the code was generated by Telegram for you, you can also verify the correctness of the code entered by the user using this method. Even if you set the code yourself, it is recommended to call this method after the user has successfully entered the code, passing the correct code in the code parameter, so that we can track the conversion rate of your verifications. On success, returns a RequestStatus object.

See the tutorial for examples >

Parameter	Type	Required	Description
request_id	String	Yes	The unique identifier of the verification request whose status you want to check.
code	String	Optional	The code entered by the user. If provided, the method checks if the code is valid for the relevant request.
revokeVerificationMessage
Use this method to revoke a verification message that was sent previously. Returns True if the revocation request was received. However, this does not guarantee that the message will be deleted. For example, if the message has already been delivered or read, it will not be removed.

Parameter	Type	Required	Description
request_id	String	Yes	The unique identifier of the request whose verification message you want to revoke.
Available types
All types used in Telegram Gateway API responses are represented as JSON objects.

It is safe to use 32-bit signed integers for storing all Integer fields unless otherwise noted.

Optional fields may be not returned when irrelevant.

RequestStatus
This object represents the status of a verification message request.

Field	Type	Description
request_id	String	Unique identifier of the verification request.
phone_number	String	The phone number to which the verification code was sent, in the E.164 format.
request_cost	Float	Total request cost incurred by either checkSendAbility or sendVerificationMessage.
is_refunded	Boolean	Optional. If True, the request fee was refunded.
remaining_balance	Float	Optional. Remaining balance in credits. Returned only in response to a request that incurs a charge.
delivery_status	DeliveryStatus	Optional. The current message delivery status. Returned only if a verification message was sent to the user.
verification_status	VerificationStatus	Optional. The current status of the verification process.
payload	String	Optional. Custom payload if it was provided in the request, 0-256 bytes.
DeliveryStatus
This object represents the delivery status of a message.

Field	Type	Description
status	String	The current status of the message. One of the following:
- sent – the message has been sent to the recipient's device(s),
- delivered – the message has been delivered to the recipient's device(s),
- read – the message has been read by the recipient,
- expired – the message has expired without being delivered or read,
- revoked – the message has been revoked.
updated_at	Integer	The timestamp when the status was last updated.
VerificationStatus
This object represents the verification status of a code.

Field	Type	Description
status	String	The current status of the verification process. One of the following:
- code_valid – the code entered by the user is correct,
- code_invalid – the code entered by the user is incorrect,
- code_max_attempts_exceeded – the maximum number of attempts to enter the code has been exceeded,
- expired – the code has expired and can no longer be used for verification.
updated_at	Integer	The timestamp for this particular status. Represents the time when the status was last updated.
code_entered	String	Optional. The code entered by the user.
Report delivery
The Telegram Gateway API can send delivery reports to a user-specified callback URL. When you include a callback_url parameter in your request, the API will send an HTTP POST request to that URL containing the delivery report for the message. The payload of the POST request will be a JSON object representing the RequestStatus object.

Your URL must respond with HTTP status code 200 to acknowledge receipt of the report. Any other status code will be considered a failure, and the service will retry sending the same report up to 10 times with increasing delays between attempts. If all retries fail, the report will be considered lost.

Checking report integrity
All reports submitted to your callback_url, if you provided one, will also contain the following headers:

X-Request-Timestamp – A Unix timestamp indicating when the server submitted the report.
X-Request-Signature – A server-generated signature needed to authenticate the report on your end.
You can confirm the origin and verify the integrity of the reports you receive by comparing the signature contained in the X-Request-Signature header with the hexadecimal representation of the HMAC-SHA-256 signature of the data-check-string with the SHA256 hash of the API token shown in your Gateway account settings.

The data-check-string is a concatenation of the report timestamp as provided by the X-Request-Timestamp header, a line feed character ('\n', 0x0A) used as separator and the raw post body of the HTTP request.

Example:

data_check_string = X-Request-Timestamp + '\n' + post_body
secret_key = SHA256(api_token)
if (hex(HMAC_SHA256(data_check_string, secret_key)) == X-Request-Signature) {
  // data is from Telegram
}
To prevent the use of outdated data, you should additionally check the X-Request-Timestamp header, which contains a Unix timestamp of when the relevant report was submitted by the server.

https://core.telegram.org/methods

https://core.telegram.org/bots/features


Weather Maps API
URL
https://api.rainviewer.com/public/weather-maps.json

Purpose and Description
Contains the past 2 hours of weather radar data with 10-minute intervals. Suitable to display in applications, on websites, or in any other mapping software.

API File Example
Here is an example of the weather maps API file. The data inside the example is out of date and cannot be used in real queries. To get actual data, please open the API file directly.

{
  "version": "2.0",
  "generated": 1609402525,
  "host": "https://tilecache.rainviewer.com",
  "radar": {
    "past": [
      {
        "time": 1609401600,
        "path": "/v2/radar/1609401600"
      },
      {
        "time": 1609402200,
        "path": "/v2/radar/1609402200"
      }
    ]
  }
}
Root Object
key	Description	Example
version	API Version.
Values: String(8)	“2.0.1”
generated	Unix timestamp date (UTC) when this API file was generated. Useful for checking for updates.
Values: Int(8)	1609402525
host	Host and protocol for the images.
Values: String(255)	https://tilecache.rainviewer.com
radar	Weather radar maps.
Values: Radar object	 
Radar Object
key	Description	Example
past	Past weather radar frames. 2 hours, with 10-minute steps.
Values: Array(Frame Object)	 
Frame Object
key	Description	Example
time	Map frame generation date in UNIX timestamp format (UTC). The map frame typically contains the images (radar) from different times, so this is not the time of the data rather than frame generation time.
Values: Int(8)	1609401600
path	Base path for the images of that frame. For information on its usage, refer to the next How to use host and path information section of this page
Values: String(255)	/v2/radar/1609401600
How to use host and path information
You should use the host and path data from the API as a part of the URL. All available URLs and their parameters are described below.

Each url starts with {host}, where:

{host} is a host from the Root Object of this API.
URL	Description
{path}/{size}/{z}/{x}/{y}/{color}/{options}.png	Radar data: displays one tile with the composite radar reflectivity data, with specified size, color scheme, and additional options.
{path}/{size}/{z}/{lat}/{lon}/{color}/{options}.png	Radar data: same as the link above, but with the center at specified coordinates (EPSG:4326) with desired zoom size. Great for widgets.
Parameters:

{x}, {y}, {z} – x, y, and zoom level of the tile that you want to download. Maximum zoom level is 7. Read more about tiles
{lat}, {lon} - latitude and longitude of specific coordinates accordingly. Decimal format. Must contain a dot in the number. Example: -32.7892, 108.67821.
{size} – image size, can be 256 or 512.
{color} - the color scheme ID. See Color Schemes.
{options} – list of options separated by the _ symbol. For example: ‘1_0’ means smoothed (1) image without snow color scheme (0). Two options are available: {smooth}_{snow}
{smooth} - blur (1) or not (0) radar data.
{snow} - display (1) or not (0) snow in separate colors on the tiles.
Weather Radar Coverage
Additionally, one more product is available: the weather radar coverage mask. This mask shows where weather radar coverage is available (transparent areas) and where it is not (black areas). We don’t update this mask often. The links are the same as for radar products, but without options and color scheme.

URL	Description
/v2/coverage/0/{size}/{z}/{x}/{y}/0/0_0.png	Coverage tile: where radar data is available (transparent areas) and where it is not (black areas).
/v2/coverage/0/{size}/{z}/{lat}/{lon}/0/0_0.png	Coverage data as above but for specified center coordinates (latitude, longitude).
Examples
Basic HTML + JS (Leaflet) example: github.com/rainviewer/rainviewer-api-example

Radar Tiles
Description	Link
Standard tile (x/y/z)	/v2/radar/1772929200/512/2/2/1/2/1_1.png
Coordinate tile (lat/lon)	/v2/radar/1772929200/256/2/35.71/-70.87/2/1_1.png
Coverage Tiles
For coverage requests, set color scheme and options to “0”. Coverage may be hard to see against white backgrounds due to transparency.

Description	Link
Standard tile	/v2/coverage/0/512/2/2/1/0/0_0.png
Coordinate tile	/v2/coverage/0/512/3/35.71/-70.87/0/0_0.png

Open sense map : https://api.opensensemap.org/

{"versions":[{"value":"v1","description":"Current version of navitia API","status":"current","links":[{"href":"https:\/\/api.navitia.io\/v1\/","templated":false,"rel":"api","type":"api"}]}]}


whatpule api : eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiY2I3OWMzNzhlNTI2NzAyYzA5OGY5MTM5ZjI0ZDAzOTQ5MjUxODk0ZjMxNzI5Nzc0NjI1NzBlMjliMTA1MTBkNjJjMzY4ZTM3ZTU0ZjBiYjAiLCJpYXQiOjE3NzI5MzcxNjMuMzc5MDgzLCJuYmYiOjE3NzI5MzcxNjMuMzc5MDg3LCJleHAiOjE4MDQ0NzMxNjMuMzcxNTQxLCJzdWIiOiIxNDYyNzEwIiwic2NvcGVzIjpbInVzZXItcHVibGljLWFwaSJdfQ.Yu5LNZvAGMY9X5S7mI4PH5cJuMUObn9r3H2ruuIRyiAn2NeW90qvAoyCIPBh-dGSioKsjMUcj-HCIkKjBVcfhWO5m5GiEqypx1__TgkFrPuLc7faRrkc4sW4aPYqoXnBuqsy3aKbnDISltViwPXh8IieAmXWsWSTCqFAA0VjrWKiNqYFM9eWB8SwNZp8YnQU7e-nJAjYvbfxi2QBWvB4mtNWctJwXHHwNXngyEv_g8ufKu3pTQteclSKKFK_eWSS5MMaRkwgOjLE-GsyKJnR_czh2-SO3KCfsZdEZaLa0yEHAkuMgqAJA9xbX-58G6QyDnwfnW0lvktb1Hekrbtk2_xK_-2yt4FKBODLJY9J-TcIJn_J7LlbHktGlwt4sXLZ9k_HMq9I6Jemi6QHcv1YpIxj_KTMXl4Is-Pj_gii4LWSfDwpgj1eCfGccBJ_DB5VkQmvIo9mUdD0_bQj1Ea48TGDWFtFOhurZ9UQw8-ZiE_MWVQ4NZx0nnnb5ui6qD8kbvfmtrEzAdz9hxv1d0OTbcBSuMF8AeDnqofjxsnKEq85CTmx4m2EmJKYeCW63FkIR8g1R14WPEGILrrezqH0Y3YRxlF1QDO9e2GQ99Cmm2Yu6WelBnuz3UERfES_RRl97ngS0pGlt_hFTmMbyabDtTx9r13XMwm2valpxxg_AQY



https://www.7timer.info/doc.php?lang=en#introduction

trackign and habit api : https://docs.pixe.la/
How do I use Pixela?
Pixela's service interface provides only the RESTish API.
Dive into the world of Pixela from the console on your machine!

1
Create your user account
Call /v1/users API by HTTP POST.

$ curl -X POST https://pixe.la/v1/users -d '{"token":"thisissecret", "username":"a-know", "agreeTermsOfService":"yes", "notMinor":"yes"}'
{"message":"Success.","isSuccess":true}
2
Create a graph definition
Call /v1/users/<username>/graphs by HTTP POST.

$ curl -X POST https://pixe.la/v1/users/a-know/graphs -H 'X-USER-TOKEN:thisissecret' -d '{"id":"test-graph","name":"graph-name","unit":"commit","type":"int","color":"shibafu"}'
{"message":"Success.","isSuccess":true}
3
Get the graph!
Browse https://pixe.la/v1/users/a-know/graphs/test-graph ! This is also /v1/users/<username>/graphs/<graphID> API.


4
Post value to the graph
Call /v1/users/<username>/graphs/<graphID> by HTTP POST.

$ curl -X POST https://pixe.la/v1/users/a-know/graphs/test-graph -H 'X-USER-TOKEN:thisissecret' -d '{"date":"20180915","quantity":"5"}'
{"message":"Success.","isSuccess":true}
5
Browse again!
Browse https://pixe.la/v1/users/a-know/graphs/test-graph, again!


6
You can also find out more about.
You can get more information by adding .html to the end of the URL on Step.6 at it in your browser! (https://pixe.la/v1/users/a-know/graphs/test-graph.html)


The API used here is only a small part. Use Pixela efficiently with a simple and easy API!

gh repo clone gettyimages/gettyimages-api_nodejs



https://api.kanye.rest


JSON API
Advice Slip JSON API
Endpoints
Random advice
Advice by ID
Searching advice
Errors and notices
Messages
Objects
Slip object
Search object
Message object
RSS
Daily advice feed
Berg
Berg Little Printer
Advice Slip JSON API
The Advice Slip JSON API is provided for free. 😎 It currently gives out over 10 million pieces of advice every year. If you would like to say thank-you to the creator, then please buy them a coffee or beer! ☕️🍺

Ko-fi donationsSupport Me on Ko-fi
Random advice
Note: Advice is cached for 2 seconds. Any repeat-request within 2 seconds will return the same piece of advice.

HTTP Method	GET
URL	https://api.adviceslip.com/advice
Description	Returns a random advice slip as a slip object.
Parameters	
callback
string To define your own callback function name and return the JSON in a function wrapper (as JSONP), add the parameter callback with your desired name as the value.
Advice by ID
HTTP Method	GET
URL	https://api.adviceslip.com/advice/{slip_id}
Description	If an advice slip is found with the corresponding {slip_id}, a slip object is returned.
Parameters	
callback
string To define your own callback function name and return the JSON in a function wrapper (as JSONP), add the parameter callback with your desired name as the value.
Searching advice
HTTP Method	GET
URL	https://api.adviceslip.com/advice/search/{query}
Description	If an advice slip is found, containing the corresponding search term in {query}, an array of slip objects is returned inside a search object.
Parameters	
callback
string To define your own callback function name and return the JSON in a function wrapper (as JSONP), add the parameter callback with your desired name as the value.
Messages
In the event of an error occuring, a message object is returned, containing relevant information about the request.

Slip object
A slip object is a simple piece of advice.

Response fields
Example
Name	Type	
slip_id	integer	The unique ID of this advice slip.
advice	string	The advice being given.
Back to top

Search object
A search object contains the results of a slip search query.

Response fields
Example
Name	Type	
total_results	integer	Total number of matching advice slips found.
query	integer	The search query provided.
slips	string	An array of slip objects matching the search query.
Back to top

Message object
A messages object contains information about the status of the requested API URL.

Response fields
Example
Name	Type	
type	string	The type of messages. Can be either noticed, warning or error.
text	string	The messages being received.
Back to top

RSS
RSS feeds allow for easy access and sharing of advice slips.

Daily Advice Slip
URL	https://api.adviceslip.com/daily_adviceslip.rss
Description	This feed provides a single piece of advice, chosen at random daily, in a simple RSS 2.0 format.
Back to top


pexels api key : axV3O0WCdAESyvgmKIQrCYdhxUG9TSrfhQGBW4RucEgq8BwGU5u7GNyP


Tommorow api key : 3eqPrq2N36ig5FR2ZaxEAlMAnOwnowmA
curl --request GET --url 'https://api.tomorrow.io/v4/weather/forecast?location=42.3478,-71.0466&apikey=3eqPrq2N36ig5FR2ZaxEAlMAnOwnowmA'
https://docs.tomorrow.io/recipes


Timezone API
Pricing
Try it out
Documentation
Integrations New
Usage
Settings
Support
Unlock more calls and features
You are currently on a free plan with limited features and usage
Upgrade
Try it out
This is your private API key, specific to this API.
Primary Key:2e202448a21f4fc5913f5f0bc406aac1
Create, rotate and manage your keys
Live test
cURL
Javascript
jQuery
NodeJS
Python
Ruby
Java
PHP
Go
Postman
https://timezone.abstractapi.com/v1/current_time/?api_key=2e202448a21f4fc5913f5f0bc406aac1&location=Oxford, United Kingdom
Documentation



c9d2NTAyODg6NDc1MjI6R0s4dzhXbTh5UVVGRXJNcA=

My Workspace
Howdy, shay
API can be used for your custom applications or automation tools such as Zapier, Make.com(Integromat) or Bubble.io to access our services.
To learn more about REST API integration: REST API Reference v2 or REST API Reference v1

API Key
c9d2NTAyODg6NDc1MjI6R0s4dzhXbTh5UVVGRXJNcA=
  

Last Updated at Mar 8, 2026 8:25 AM

Log Request

Enable/Disable API Logs. API logs are generated for troubleshooting and it's retained for up to 14 days.

 Welcome to APITemplate.io
APITemplate.io allows you to generate images or PDF documents with a simple API.
The followings are the steps to create an image template or PDF template:
1. On the dashboard, click on the Manage Templates in the upper tabs.
2. On the Manage Templates, click on the New Image Template or New PDF Template button to create a new template.
3. Select a template, then click on Create.
4. Next, edit the template by launching the Image or PDF Editor.
5. You can preview the image/PDF by clicking the Preview button.

enigma keys: API Keys
Manage the keys used to access Enigma Console

API Keys
2
Name, owner or key

Name
Owner
Key

Default Workspace
Service
PzJKU3Vx0ySVjrAtKKcYRI4icahw2pHA1l04uBQT



zebbroka@gmail.com
Default
zebbroka@gmail.com
You
WznCm2Y9hjrEqQqR1FjwmeUrulA30enMLPggPoTR


https://documentation.enigma.com/growth/lead-lists?_gl=1*u7fc0c*_gcl_au*MTk4MDYwMTU0Mi4xNzcyOTMxMDIw*_ga*MjYzOTAxMTM0LjE3NzI5MzEwMjA.*_ga_TCFSWXY47R*czE3NzI5MzEwMjAkbzEkZzEkdDE3NzI5MzEzMjkkajE2JGwwJGgw


https://console.enigma.com/explore/segments?_gl=1*13dkls2*_gcl_au*MTk4MDYwMTU0Mi4xNzcyOTMxMDIw*_ga*MjYzOTAxMTM0LjE3NzI5MzEwMjA.*_ga_TCFSWXY47R*czE3NzI5Mzg3ODQkbzIkZzAkdDE3NzI5Mzg3ODQkajYwJGwwJGgw





Mobile Device Farm MCP
A
PREMIUM
14
1.0.0
MarcoCarnevali
Today
JavaScript
MIT License
7
Overview
Installation Method
Skill Features
Related Recommendations
Score
Agents Using This Skill
Version History

Need Help?
View Source Code
Report Issue
Install via Npm

MCP server config
MCP server config
{
  "mcpServers": {
    "marcocarnevali-mobile-device-farm-mcp": {
      "args": [
        "-y",
        "mobile-device-farm-mcp"
      ],
      "command": "npx"
    }
  }
}
Installation Guide
Run the server directly using npx without global installation.

$ npx -y mobile-device-farm-mcp
System Dependencies
nodejs
installed
Install via Npm
Run the server after global installation via npm.

Install via Manual
Run the server locally after cloning and building. Replace '/path/to/mobile-device-farm-mcp/dist/index.js' with the actual path to the built index.js file.

Local Service
This server can only run on the client’s local device, requiring installation and relying on local resources.
Table of Contents
Install via Npm
Install via Npm
Install via Manual
Related MCP Servers
View More
Desktop Commander MCP
MCP server for terminal operations and file editing. Requires Node.js runtime (>=18.0.0).

ADW Google MCP
Google Workspace MCP server — 85 tools for Drive, Docs, Sheets, Calendar, and Gmail. Connects AI assistants via the Model Context Protocol. Requires Google OAuth credentials which can be configured via environment variables or interactive setup wizard.

@supercorp/shell-mcp
An MCP server that gives AI agents shell access. Provides a run_command tool for executing shell commands and returning stdout, stderr, and exit code. Supports Streamable HTTP, SSE, and stdio transports.

CLOV - Context Limiter & Output Vetter
CLOV is a specialized JSON-RPC proxy that intercepts and compresses MCP responses to reduce context bloat and improve efficiency. It can also intercept raw terminal streams to clean output. Configuration can be supplied via environment variables such as CLOV_MCP_MAX_TOKENS, CLOV_MCP_MAX_ARRAY_ITEMS, CLOV_MCP_MAX_OBJECT_KEYS, CLOV_MCP_PRESERVE_CODE, and CLOV_MCP_AGGRESSIVE_CHROME_STRIP.

OculOS
OculOS is a lightweight daemon that reads the OS accessibility tree and exposes UI elements as a JSON REST API and MCP server. It requires no dependencies and runs as a single binary. The server can be run in MCP mode with the '--mcp' flag.

Excel MCP Server
Excel MCP Server for manipulating Excel files. When using SSE transport, the EXCEL_FILES_PATH environment variable must be set to specify the directory for Excel files (defaults to ./excel_files if not set).

 即梦AI多模态MCP
A
PREMIUM
4
5
1.0.14
freeleepm
Today
TypeScript
MIT License
77
Overview
Installation Method
Skill Features
Related Recommendations
Score
Agents Using This Skill
Version History

Need Help?
View Source Code
Report Issue
Install via Npm

MCP server config
MCP server config
{
  "mcpServers": {
    "freeleepm-jimeng-ai-mcp": {
      "args": [
        "jimeng-ai-mcp"
      ],
      "command": "npx"
    }
  }
}
Installation Guide
Run the server using npx with environment variables JIMENG_ACCESS_KEY and JIMENG_SECRET_KEY set.

$ npx jimeng-ai-mcp
Environment Variables
Name	Type	Required	Description
JIMENG_ACCESS_KEY	
Your Volcengine Jimeng AI access key
JIMENG_SECRET_KEY	
Your Volcengine Jimeng AI secret key
System Dependencies
nodejs
>=14.0.0
Install via Manual
Run the server locally after cloning and building. Replace 'dist/examples/mcp-server.js' if your build output path differs.

Install via Docker
Build and run the Docker image. Set environment variables JIMENG_ACCESS_KEY and JIMENG_SECRET_KEY in your Docker environment or host.

Local Service
This server can only run on the client’s local device, requiring installation and relying on local resources.
Table of Contents
Install via Npm
Install via Manual
Install via Docker
Related MCP Servers
View More
MCP Server Chart
A Model Context Protocol server for generating charts using AntV. This is a TypeScript-based MCP server that provides chart generation capabilities. It allows you to create various types of charts through MCP tools.

openrouter-image-gen-mcp
MCP server for image generation via OpenRouter — supports quality presets, image editing, batch operations, and multiple models. Requires an OpenRouter API key configured via the environment variable OPENROUTER_API_KEY.

multimodal-mcp
Multi-provider media generation MCP server. Requires setting API keys via environment variables: OPENAI_API_KEY, XAI_API_KEY, GEMINI_API_KEY (or GOOGLE_API_KEY). Optionally configure MEDIA_OUTPUT_DIR for saved media files.

mcp-gif
MCP server for GIF animation analysis. Provides metadata extraction, individual frame export, and per-frame timing information.

Anime Garden
Anime Garden is a third-party mirror and BT resource aggregation site for anime, providing an open API for developers and an MCP server endpoint at https://api.animes.garden/mcp. No external data files are required for the MCP server usage.

markly-mcp-server
MCP server for Markly.cloud to add watermarks to images via AI agents. Supports free tier without API key and optional API key for higher limits and no branding.



whapi-mcp
A
PREMIUM
161
1
1
0.0.1
Whapi-Cloud
Today
JavaScript
38
Overview
Installation Method
Skill Features
Related Recommendations
Score
Agents Using This Skill
Version History

Need Help?
View Source Code
Report Issue
What can you do with this MCP Server?
The whapi-mcp Server is a Node.js-based protocol server for WhatsApp API integration. You can:

Channel Management: Monitor and control the WhatsApp channel status, retrieve and update channel settings, and test webhooks
User Authentication and Profile: Login via QR code or auth code, get and update user profile information, and change status messages
Messaging: Send, receive, forward, react, delete, and manage messages across chats, including media, links, locations, contacts, polls, stickers, and status updates
Chat and Contact Operations: Access chat metadata, archive, delete, pin, unpin, and manage contacts, check WhatsApp availability, and retrieve profile pictures
Group and Community Management: Create, update, join, leave, promote, demote, and manage group and community settings, including invites, participants, and subgroups
Media Handling: Upload, retrieve, and delete media files, and send media messages such as images, videos, GIFs, audio, documents, and stickers
Catalog and Business Profile: Manage WhatsApp Business profiles, products, catalogs, collections, labels, and associated media
Newsletter and Channel Operations: Create, find, subscribe, unsubscribe, and delete newsletters and channels, including managing newsletter invites and admin requests
Advanced Features: Handle WhatsApp channels, create events, manage community groups, and perform health checks and limits monitoring
whapi-mcp
A Model Context Protocol (MCP) server for Whapi Cloud (WhatsApp API).

Quick start
Requires Node.js 18+.

Install and run via NPX:

npx -y whapi-mcp@latest
Or set your Whapi API token and run:

# PowerShell
$env:API_TOKEN="YOUR_TOKEN"; npx -y whapi-mcp@latest
Using with MCP clients
Cursor: add to %USERPROFILE%.cursor\mcp.json
{
  "mcpServers": {
    "whapi-mcp": {
      "command": "npx",
      "args": ["-y", "whapi-mcp@latest"],
      "env": { "API_TOKEN": "YOUR_TOKEN" }
    }
  }
}
Claude Desktop: add to %APPDATA%\Claude\claude_desktop_config.json (same structure as above).
Tools
The server exposes tools generated from Whapi OpenAPI. Example:

sendMessageText (required: to, body)
Example call (pseudo):

name: sendMessageText
arguments: { "to": "1234567890@s.whatsapp.net", "body": "Hello" }
License
MIT

Related MCP Servers
View More
ByCrawl MCP Server
SignalsurfAi
B
GOOD
56
MCP server for ByCrawl — query 8 social media platforms from AI agents like Claude and Cursor. Requires external API key configured via environment variable BYCRAWL_API_KEY. Optional BYCRAWL_API_URL can be set for self-hosting.

Today
Social Media
Local Service
3
3
exchangehandles-mcp
exchangehandles
A
PREMIUM
8
MCP server for ExchangeHandles — the AI Agent Identity Registry. Check handle availability, get AI valuations, search the marketplace, and manage agent identities. Optionally requires an API key configurable via environment variable EXCHANGEHANDLES_API_KEY or config file ~/.exchangehandles/config.json.

Today
Social Media
Local Service
2
企业微信机器人 MCP 服务
HammCn
A
PREMIUM
3
企业微信机器人 MCP (Model Context Protocol) 服务，支持发送 Markdown 消息、文件和图片。 Requires setting WECOM_WEBHOOK_KEY environment variable with the webhook key from your WeCom group robot.

Today
Social Media
Local Service
7
discord-mcp
tensakulabs
B
GOOD
19
Discord selfbot MCP server — read & send Discord messages from Claude Code or OpenClaw. Requires a Discord user token extracted via the desktop app DevTools console.

Today
Social Media
Local Service
4
WhatsApp API 多设备版本
aldinokemal
Unvalidated
支持多设备和 MCP（模型上下文协议）服务器集成的 WhatsApp API，适用于 AI 代理和工具。支持通过命令行参数、环境变量和 .env 文件进行配置。需要 FFmpeg 进行媒体处理。无需通过环境变量提供外部数据文件。

Today
Social Media
Hybrid Service
35
3624
Instagram CLI
lupikovoleg
Unvalidated
Interactive Instagram stats and analysis CLI powered by HikerAPI and OpenRouter. Requires external environment configuration file for API keys, configurable via INSTAGRAM_CLI_ENV_FILE environment variable.

Today
Social Media
Local Service
2
11
Local Service
This server can only run on the client’s local device, requiring installation and relying on local resources.
Installation Configuration
View Details
MCP server config
MCP server config
{
  "mcpServers": {
    "whapi-cloud-whapi-mcp": {
      "args": [
        "-y",
        "whapi-mcp@latest"
      ],
      "command": "npx"
    }
  }
}
Table of Contents
Quick start
Using with MCP clients
Tools
License
 Like Our Product? Star on GitHub and Share feedback !


 6 Claude Skills for Real Estate Wholesalers
Unvalidated
1.0.0
miron-tech
Today
2
Overview
Installation Method
Skill Features
Related Recommendations
Score
Agents Using This Skill
Version History

Need Help?
View Source Code
Report Issue
Install via Manual

MCP server config
MCP server config
{
  "mcpServers": {
    "miron-tech-wholesaler-claude-skills": {
      "args": [
        "-y",
        "@anthropic/perplexity-mcp"
      ],
      "command": "npx"
    }
  }
}
Installation Guide
Run MCP servers for Perplexity and Firecrawl using npx commands with your API keys set in environment variables. Replace API keys with your own. Use Claude Code to run the skills.

git clone https://github.com/miron-tech/wholesaler-claude-skills.git

copy the .claudeskills folder and CLAUDE.md file into your project directory

configure MCP servers for Perplexity and Firecrawl with API keys

optionally configure GoHighLevel MCP integration with private token

use Claude Code in your project directory to run the skills

$ npx -y @anthropic/perplexity-mcp
Environment Variables
Name	Type	Required	Description
PERPLEXITY_API_KEY	
API key for Perplexity MCP server
System Dependencies
nodejs
installed
git
installed
Install via None
Run Firecrawl MCP server using npx with your API key set in environment variables.

Install via None
Connect to GoHighLevel MCP server via HTTP using your private integration token in the Authorization header.



How Enigma Searches & Matches
Overview
Enigma’s search system finds the entity in Enigma’s data that best matches the information you have — whether its a brand, an operating location, or a legal entity.

To search, you provide identifying information about the entity, such as its name, address, website. Enigma then returns the best-matching entity based on your input.

Under the hood, the search process combines a retrieval engine with a ranking model.

Retrieval surfaces potential candidate entities from Enigma’s database.
Ranking evaluates and scores those candidates to determine how likely they are to represent the same real-world entity.
Together, these components balance recall and precision, to return accurate, high-confidence results.

Matching is Searching with One Result
Whether you type your inputs into the search bar in the Enigma Console or submit them to one of Enigma's APIs, the underlying search system is the same. The general process is typically referred to as “Searching,” whereas programmatically retrieving the first result of a search is typically referred to as “Matching.”

Entity Linking and Search Flexibility
To search, you first specify the type of entity you want to retrieve — a brand, an operating location, or a legal entity. You can then search for that entity using any identifying information you have available, even if that information originates from another related entity type. For instance, you can search for:

A brand using the name of the legal entity that owns it.
A brand using the address of one of its operating locations.
A legal entity using the brand name it operates under.
This flexibility is made possible by the links within Enigma’s data model. Using these relationships, the search system can interpret your input holistically and surface the most relevant results — even when the information provided describes a related aspect of the business rather than the exact entity type requested.

Input Fields
Enigma can search for entities with any of the following inputs:

Category	Input Fields	Brand	Operating Location	Legal Entity
Business Name	Name	✅	✅	✅
Address	streetAddress1, streetAddress2, city, state, zip	✅	✅	✅
Person Name	firstName, lastName	✅	✅	✅
Website	Website	✅	✅	❌
Phone Number	Phone Number	✅	✅	❌
Every search request must include at least one of the following identifying fields: a business name, a website, or a person’s first and last name. All other inputs are optional, but more complete and representative data typically improves the quality and confidence of the results.

The Matching Process
You don’t need perfect information to find the right business.

Enigma’s search system is designed to match imperfect or partial inputs — like a misspelled name, an incomplete address, or a missing website — to the correct entity. It then evaluates a combination of features to measure how closely your input matches what’s in Enigma’s data — for instance, by comparing similarities across names, websites, and addresses. Finally, it returns the results that best match your input and chosen entity type, filtered by our accuracy standards.

When there isn’t enough evidence to suggest a good match, the system returns no result — in order to avoid false positives (incorrect matches).

Optimized for precision
Based on labeled evaluation data, Enigma’s search precision is about 94% for searches of all three entities. The precision of your results largely depends on the quality and completeness of your input data. The cleaner and more representative the inputs, the more precise the results. Reach out to us for best practices if you’re working with dirty input data.

When a search request is submitted, Enigma’s system performs a two-stage process: retrieval and ranking.

Retrieval
The query first passes through Enigma’s retrieval service, which uses a fast search index to identify a broad set of potential candidate records from Enigma’s database.

Before the search begins, the system cleans and standardizes all input fields to ensure consistent, high-quality results.

Text fields are normalized — extra spaces are removed, and casing is standardized for uniform comparison.
Addresses are parsed and standardized into consistent components such as street, city, state, and postal code.
Website URLs are decomposed into their core parts (domain, subdomain, top-level domain) to improve recognition across variations.
Phone numbers are normalized into a canonical format.
This preprocessing step ensures that even if your input data varies in formatting or structure, the retrieval service can surface the most relevant candidate records for scoring. These candidates represent entities that are likely to correspond to your input based on attributes like name, address, and website.

Ranking
Model Evaluation

Once candidate records are retrieved, each is evaluated by Enigma’s ranking service — a machine-learning system that estimates how likely each candidate refers to the same entity as the user’s input.

For every input–candidate pair, the system computes a series of similarity measures across key fields such as:

How closely the business names align (including shared words and variants)
Whether phone numbers are identical or closely related
How similar the websites or domains are
Geographic consistency — whether they appear in the same city or state
Address structure and text overlap
These similarity values capture the degree of alignment between your input and each candidate, and they form the raw ingredients for the model’s decision-making. The ranking model then uses the learned weights to calculate a match probability, representing how likely it is that the input and candidate refer to the same underlying entity. This approach allows the system to balance multiple signals and produce consistent, data-driven match scores across a wide range of input types and data qualities.

Ranking & Output

After probabilities are computed for all candidates, results are ranked in descending order of their match probability. The top-ranked entities are those with the highest likelihood of being true positive (correct) matches.

Enigma’s search models continuously evolve as new data is incorporated and more links are added to Enigma’s Data Model, increasing both recall (match rate) and precision (match correctness).

maheidem/linkedin-mcp
A
PREMIUM
7
1.1.0
maheidem
Today
JavaScript
MIT License
63
Overview
Installation Method
Skill Features
Related Recommendations
Score
Agents Using This Skill
Version History

Need Help?
View Source Code
Report Issue
What can you do with this MCP Server?
The @maheidem/linkedin-mcp Server is a comprehensive LinkedIn API integration that facilitates authentication, content creation, and user information retrieval. You can:

Authentication Management: Log in, check authentication status, and log out of LinkedIn accounts
Content Creation: Create and publish posts on LinkedIn
User Information: Retrieve user URNs and diagnostic user info for account insights
@maheidem/linkedin-mcp
npm version License: MIT

A comprehensive LinkedIn API MCP (Model Context Protocol) server that integrates seamlessly with Claude Desktop/Code. This package provides full LinkedIn functionality including post creation, profile optimization, content generation, and analytics - all accessible through Claude's natural language interface.

🚀 Quick Start
Install and configure with a single command:

npx @maheidem/linkedin-mcp install
That's it! The installer will:

✅ Install the MCP server
✅ Automatically configure Claude Desktop/Code
✅ Set up token storage
✅ Provide setup instructions
📋 Features
✨ Core Functionality
🚀 LinkedIn Posting: Create and publish posts with full formatting
🔍 Profile Analytics: Get detailed insights and optimization recommendations
📊 Content Analytics: Track post performance and engagement metrics
🎯 Content Generation: AI-powered post creation with industry best practices
👤 Profile Management: Update and optimize LinkedIn profiles
🔐 Secure OAuth: Robust token management with automatic refresh
🛠 Developer Features
📱 Cross-Platform: Works on Windows, macOS, and Linux
🔧 CLI Management: Easy installation, configuration, and maintenance
📖 Comprehensive API: All LinkedIn REST API endpoints available
🔒 Security First: Secure token storage and handling
📚 Full Documentation: Complete API reference and examples
📦 Installation Methods
Method 1: NPX Install (Recommended)
npx @maheidem/linkedin-mcp install
Method 2: Global Install + Setup
npm install -g @maheidem/linkedin-mcp
linkedin-mcp install
Method 3: Local Install
npm install @maheidem/linkedin-mcp
npx linkedin-mcp install
🔧 CLI Commands
Installation & Setup
# Install and configure for Claude
linkedin-mcp install
# Check installation status  
linkedin-mcp status
# Set up LinkedIn OAuth credentials
linkedin-mcp auth
# Remove configuration
linkedin-mcp uninstall
Usage Examples
# Check if everything is working
linkedin-mcp status
# Set up authentication
linkedin-mcp auth
🔐 Authentication Setup
After installation, you need to set up LinkedIn OAuth:

Create LinkedIn App:
Go to LinkedIn Developers
Create a new app
Note your Client ID and Client Secret
Configure Redirect URI:
Add http://localhost:3000/callback to your app's redirect URIs
Set Up Credentials:
linkedin-mcp auth
Complete OAuth Flow:
Use the LinkedIn OAuth flow to get an access token
The token will be automatically managed by the MCP server
🎯 Usage with Claude
Once installed, you can use LinkedIn functionality directly in Claude:

Creating Posts
Create a LinkedIn post about the latest developments in AI, targeting ML engineers and including relevant hashtags.
Profile Optimization
Analyze my LinkedIn profile and provide optimization recommendations for better visibility in the tech industry.
Content Strategy
Generate 5 LinkedIn post ideas about machine learning trends, each with different engagement strategies.
Analytics & Insights
Show me the performance metrics for my last 10 LinkedIn posts and identify the most engaging content types.
📊 Available Tools
The MCP server provides these tools to Claude:

🚀 Posting & Content
linkedin_create_post - Create and publish posts
linkedin_create_optimized_post - AI-generated optimized posts
linkedin_post_profile_update - Announce profile changes
📊 Analytics & Data
linkedin_get_user_posts - Retrieve your posts with pagination
linkedin_get_post_details - Detailed post analytics
linkedin_get_user_activity - Activity timeline and engagement
👤 Profile Management
linkedin_get_user_info - User profile information
linkedin_analyze_profile_from_data - Profile optimization analysis
linkedin_generate_optimized_content - Content generation for profiles
🔐 Authentication
linkedin_get_auth_url - Generate OAuth URLs
linkedin_exchange_code - Handle OAuth token exchange
🔧 Configuration
Claude Configuration Location
The installer automatically detects and configures:

macOS: ~/Library/Application Support/Claude/claude_desktop_config.json
Windows: %APPDATA%/Claude/claude_desktop_config.json
Linux: ~/.config/claude/claude_desktop_config.json
Token Storage
Tokens are securely stored at:

All Platforms: ~/.linkedin-mcp/tokens/
Example Configuration
{
  "mcpServers": {
    "linkedin-complete": {
      "command": "node",
      "args": ["/path/to/server/linkedin-complete-mcp.js"],
      "env": {
        "LINKEDIN_TOKEN_STORAGE_PATH": "/home/user/.linkedin-mcp/tokens"
      }
    }
  }
}
🐛 Troubleshooting
Installation Issues
# Check status
linkedin-mcp status
# Reinstall if needed
linkedin-mcp uninstall
linkedin-mcp install
Authentication Problems
# Reset credentials
linkedin-mcp auth
# Check token storage
ls ~/.linkedin-mcp/tokens/
Claude Integration Issues
Restart Claude Desktop/Code after installation
Check configuration file location matches your system
Verify MCP server permissions
Common Solutions
"Server not found": Run linkedin-mcp install again
"Token expired": The server automatically refreshes tokens
"Permission denied": Check file permissions on token directory
📚 API Reference
Core Methods
Creating Posts
// Through Claude's natural language interface:
"Create a post about AI trends with these key points: [points]"
// Direct API usage:
linkedin_create_post({
  text: "Your post content here",
  visibility: "PUBLIC"
})
Profile Analysis
linkedin_analyze_profile_from_data({
  name: "Your Name",
  currentHeadline: "Current headline",
  industry: "Technology"
})
See API_REFERENCE.md for complete documentation.

🔒 Security & Privacy
🔐 Secure Storage: Tokens encrypted and stored locally
🔄 Auto-Refresh: Automatic token renewal
🚫 No Data Collection: No analytics or tracking
🏠 Local First: All processing happens on your machine
🤝 Contributing
Contributions welcome! Please see our contributing guidelines.

Development Setup
git clone https://github.com/maheidem/linkedin-mcp
cd linkedin-mcp
npm install
npm run build
Testing & Examples
# Run unit tests
npm test
# Run example scripts
npm run test:examples
npm run test:oauth
# Try the demo
npm run demo
# Development mode
npm run dev
Project Structure
├── src/                    # TypeScript source code
├── dist/                   # Compiled JavaScript
├── examples/               # Usage examples and demos
├── tests/                  # Test files
├── docs/                   # Documentation
├── configs/                # Configuration templates
└── .github/workflows/      # CI/CD workflows
📄 License
MIT License - see LICENSE file for details.

🙏 Acknowledgments
Built with:

Model Context Protocol SDK
LinkedIn REST API
Commander.js
📞 Support
🐛 Issues: GitHub Issues
📚 Documentation: Full Docs
💬 Discussions: GitHub Discussions
Made with ❤️ for the Claude community

Related MCP Servers
View More
ByCrawl MCP Server
SignalsurfAi
B
GOOD
56
MCP server for ByCrawl — query 8 social media platforms from AI agents like Claude and Cursor. Requires external API key configured via environment variable BYCRAWL_API_KEY. Optional BYCRAWL_API_URL can be set for self-hosting.

Today
Social Media
Local Service
3
3
exchangehandles-mcp
exchangehandles
A
PREMIUM
8
MCP server for ExchangeHandles — the AI Agent Identity Registry. Check handle availability, get AI valuations, search the marketplace, and manage agent identities. Optionally requires an API key configurable via environment variable EXCHANGEHANDLES_API_KEY or config file ~/.exchangehandles/config.json.

Today
Social Media
Local Service
2
企业微信机器人 MCP 服务
HammCn
A
PREMIUM
3
企业微信机器人 MCP (Model Context Protocol) 服务，支持发送 Markdown 消息、文件和图片。 Requires setting WECOM_WEBHOOK_KEY environment variable with the webhook key from your WeCom group robot.

Today
Social Media
Local Service
7
discord-mcp
tensakulabs
B
GOOD
19
Discord selfbot MCP server — read & send Discord messages from Claude Code or OpenClaw. Requires a Discord user token extracted via the desktop app DevTools console.

Today
Social Media
Local Service
4
WhatsApp API 多设备版本
aldinokemal
Unvalidated
支持多设备和 MCP（模型上下文协议）服务器集成的 WhatsApp API，适用于 AI 代理和工具。支持通过命令行参数、环境变量和 .env 文件进行配置。需要 FFmpeg 进行媒体处理。无需通过环境变量提供外部数据文件。

Today
Social Media
Hybrid Service
35
3624
Instagram CLI
lupikovoleg
Unvalidated
Interactive Instagram stats and analysis CLI powered by HikerAPI and OpenRouter. Requires external environment configuration file for API keys, configurable via INSTAGRAM_CLI_ENV_FILE environment variable.

Today
Social Media
Local Service
2
11
Local Service
This server can only run on the client’s local device, requiring installation and relying on local resources.
Installation Configuration
View Details
MCP server config
MCP server config
{
  "mcpServers": {
    "maheidem-linkedin-optimizer-mcp": {
      "args": [
        "linkedin-mcp",
        "install"
      ],
      "command": "npx"
    }
  }
}


Smart Rabbit MCP Server
A
PREMIUM
3
1.6.0
contactjccoaching-wq
Today
MIT License
5
Overview
Installation Method
Skill Features
Related Recommendations
Score
Agents Using This Skill
Version History

Need Help?
View Source Code
Report Issue
Install via Npm

MCP server config
MCP server config
{
  "mcpServers": {
    "contactjccoaching-wq-smartrabbit-mcp": {
      "args": [
        "-y",
        "smartrabbit-mcp"
      ],
      "command": "npx"
    }
  }
}
Installation Guide
Easiest option using npx with no installation required.

$ npx -y smartrabbit-mcp
System Dependencies
nodejs
>=18.0.0
Install via Npm
Global installation via npm allows running the server command directly.

Install via Manual
Run from source after cloning and installing dependencies. Replace '/path/to/smartrabbit-mcp/index.js' with the actual path to the index.js file.

Local Service
This server can only run on the client’s local device, requiring installation and relying on local resources.
Table of Contents
Install via Npm
Install via Npm
Install via Manual
Related MCP Servers
View More
mcp-ratchet-clinical-charting
MCP server for clinical charting with Claude (codename: Ratchet) - enables Claude to document patient visits directly into Electronic Medical Records, reducing administrative burden for home health nurses. Supports mock mode by default; production mode requires configuration of POINTCARE_API_URL and POINTCARE_API_KEY environment variables for EMR integration.

MFP MCP Server
MCP server for MyFitnessPal data. Requires a cookies.txt export of your MyFitnessPal session configured vi



security-mcp
A
PREMIUM
7
2
1.0.0
AbrahamOO
Today
TypeScript
MIT License
1
Overview
Installation Method
Skill Features
Related Recommendations
Score
Agents Using This Skill
Version History

Need Help?
View Source Code
Report Issue
Install via Npm

MCP server config
MCP server config
{
  "mcpServers": {
    "abrahamoo-security-mcp": {
      "args": [
        "-y",
        "security-mcp",
        "serve"
      ],
      "command": "npx"
    }
  }
}
Installation Guide
Run the MCP server using npx. This is the recommended and primary deployment method.

$ npx -y security-mcp serve
System Dependencies
nodejs
>=20
Install via Manual

MCP server config
MCP server config
{
  "mcpServers": {
    "abrahamoo-security-mcp": {
      "args": [
        "dist/cli/index.js",
        "serve"
      ],
      "command": "node"
    }
  }
}
Installation Guide
Manual setup by cloning the repository, installing dependencies, building, and running the server. The user must run the build step before serving.

git clone https://github.com/AbrahamOO/security-mcp.git

cd security-mcp

npm install

npm run build

node dist/cli/index.js serve

$ node dist/cli/index.js serve
System Dependencies
nodejs
>=20
git
installed



Free, Unlimited OpenAI API
Nariman Jelveh, Reynaldi Chernando
Updated: March 6, 2026
This tutorial will show you how to use Puter.js to access OpenAI API for free, without needing an OpenAI API key. Puter.js allows you to provide your users with powerful AI capabilities. You can access GPT-5.4, GPT-5.3 Chat, GPT-5.2, GPT-5.3-Codex, GPT Image, and more directly from your frontend code without any server-side setup.

Puter is the pioneer of the "User-Pays" model, which allows developers to incorporate AI capabilities into their applications while each user will cover their own usage costs. This model enables developers to offer advanced AI capabilities to users at no cost to themselves, without any API keys or server-side setup.

Getting Started
To use Puter.js, import our NPM library in your project:

// npm install @heyputer/puter.js
import { puter } from '@heyputer/puter.js';
Or alternatively, add our script via CDN if you are working directly with HTML, simply add it to the <head> or <body> section of your code:

<script src="https://js.puter.com/v2/"></script>
Nothing else is required to start using Puter.js for free access to OpenAI API models and capabilities.

Example 1: Use gpt-5-nano for text generation
To generate text using GPT-5 nano, use the puter.ai.chat() function:

puter.ai.chat("What are the benefits of exercise?", { model: "gpt-5-nano" })
    .then(response => {
        puter.print(response);
    });
Full code example:

<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        puter.ai.chat("What are the benefits of exercise?", { model: "gpt-5-nano" })
            .then(response => {
                puter.print(response);
            });
    </script>
</body>
</html>
Example 2: Generate images with GPT Image
To create images using GPT Image, use the puter.ai.txt2img() function:

puter.ai.txt2img("A futuristic cityscape at night", { model: "gpt-image-1.5" })
    .then(imageElement => {
        document.body.appendChild(imageElement);
    });
Full code example:

<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        puter.ai.txt2img("A futuristic cityscape at night", { model: "gpt-image-1.5" })
            .then(imageElement => {
                document.body.appendChild(imageElement);
            });
    </script>
</body>
</html>
Find more image generation examples in the GPT Image API tutorial.

Example 3: Analyze images
To analyze images, simply provide an image URL to puter.ai.chat():

puter.ai.chat(
    "What do you see in this image?", 
    "https://assets.puter.site/doge.jpeg",
    { model: "gpt-5-nano" }
)
.then(response => {
    puter.print(response);
});
Full code example:

<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        puter.ai.chat(
            "What do you see in this image?", 
            "https://assets.puter.site/doge.jpeg",
            { model: "gpt-5-nano" }
        )
        .then(response => {
            puter.print(response);
        });
    </script>
</body>
</html>
Example 4: Use different OpenAI models
You can specify different OpenAI models using the model parameter:

// Using gpt-5.4 model
puter.ai.chat(
    "Write a short poem about coding",
    { model: "gpt-5.4" }
).then(response => {
    puter.print(response);
});

// Using gpt-5.3-chat model
puter.ai.chat(
    "Write a short poem about coding",
    { model: "gpt-5.3-chat" }
).then(response => {
    puter.print(response);
});

// Using gpt-5.2 model
puter.ai.chat(
    "Write a short poem about coding",
    { model: "gpt-5.2" }
).then(response => {
    puter.print(response);
});
Full code example:

<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        // Using gpt-5.4 model
        puter.ai.chat(
            "Write a short poem about coding",
            { model: "gpt-5.4" }
        ).then(response => {
            puter.print(response);
        });

        // Using gpt-5.3-chat model
        puter.ai.chat(
            "Write a short poem about coding",
            { model: "gpt-5.3-chat" }
        ).then(response => {
            puter.print(response);
        });

        // Using gpt-5.2 model
        puter.ai.chat(
            "Write a short poem about coding",
            { model: "gpt-5.2" }
        ).then(response => {
            puter.print(response);
        });
    </script>
</body>
</html>
Example 5: Stream responses for longer queries
For longer responses, use streaming to get results in real-time:

async function streamResponse() {
    const response = await puter.ai.chat(
        "Explain the theory of relativity in detail", 
        {stream: true}
    );
    
    for await (const part of response) {
        puter.print(part?.text);
    }
}

streamResponse();
Full code example:

<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        async function streamResponse() {
            const response = await puter.ai.chat(
                "Explain the theory of relativity in detail", 
                {stream: true, model: "gpt-5-nano"}
            );
            
            for await (const part of response) {
                puter.print(part?.text);
            }
        }

        streamResponse();
    </script>
</body>
</html>
Example 6: Control randomness and length with `temperature` and `max_tokens`
To control randomness and length, you can use the temperature and max_tokens parameters in the options object:

<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        (async () => {
            // Low temperature (0.2) for focused, deterministic output
            const focused = await puter.ai.chat(
                'Tell me about planet Mars', 
                { 
                    temperature: 0.2,
                    max_tokens: 10 
                }
            );
            puter.print('<b>Low temperature (0.2), max_tokens: 10:</b><br>' + focused + '<br><br>');
            
            // High temperature (0.8) for creative, varied output  
            const creative = await puter.ai.chat(
                'Tell me about planet Mars',
                { 
                    temperature: 0.8,
                    max_tokens: 50
                }
            );
            puter.print('<b>High temperature (0.8), max_tokens: 50:</b><br>' + creative);
        })();
    </script>
</body>
</html>
This example shows how temperature affects output randomness (lower = more focused, higher = more creative) and how max_tokens limits the response length.

Example 7: Tool/Function Calling
Here's a concise section for tool/function calling:

<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        // Define a calculator tool
        const tools = [{
            type: "function",
            function: {
                name: "calculate",
                description: "Perform basic math operations",
                parameters: {
                    type: "object",
                    properties: {
                        operation: {
                            type: "string",
Show 28 more lines...
This example shows how to define tools that the AI can call and process the function calls in your code.

Example 8: Web Search
Use web search to generate up-to-date and accurate responses from the Internet.

puter.ai
.chat("Summarize what the User-Pays Model is: https://docs.puter.com/user-pays-model/", {
    model: "openai/gpt-5.2-chat",
    tools: [{ type: "web_search" }],
})
.then(puter.print);
Full code example:

<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        puter.print(`Loading...`);
        puter.ai
            .chat("Summarize what the User-Pays Model is: https://docs.puter.com/user-pays-model/", {
                model: "openai/gpt-5.2-chat",
                tools: [{ type: "web_search" }],
            })
            .then(puter.print);
    </script>
</body>
</html>
Example 9: Basic text-to-speech
OpenAI supports text-to-speech capability which you can use via Puter.js.

puter.ai.txt2speech("Hello world! This is OpenAI text-to-speech.", {
    provider: "openai",
})
.then(audio => {
    audio.setAttribute("controls", "");
    document.body.appendChild(audio);
});
Full code example:

<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        puter.print("Loading...");
        puter.ai.txt2speech("Hello world! This is OpenAI text-to-speech.", {
            provider: "openai",
        })
        .then(audio => {
            audio.setAttribute("controls", "");
            document.body.appendChild(audio);
        });
    </script>
</body>
</html>
Find more text-to-speech examples in the OpenAI Text to Speech API tutorial.

Example 10: Using GPT-OSS model
GPT-OSS is open source model family from OpenAI.

puter.ai
    .chat(
        "Debug this logic: If I have 3 apples and give away 5, how many do I have?",
        { model: "openai/gpt-oss-120b", stream: true }
    )
    .then(async (resp) => {
        for await (const part of resp) {
        if (part?.reasoning) puter.print(part?.reasoning);
        else puter.print(part?.text);
        }
    });
Full code example:

<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
      puter.ai
        .chat(
          "Debug this logic: If I have 3 apples and give away 5, how many do I have?",
          { model: "openai/gpt-oss-120b", stream: true }
        )
        .then(async (resp) => {
          for await (const part of resp) {
            if (part?.reasoning) puter.print(part?.reasoning);
            else puter.print(part?.text);
          }
        });
    </script>
</body>
</html>
Find more examples in the GPT OSS API tutorial.

Example 11: Code generation with Codex
Codex is OpenAI's code generation model family, optimized for programming tasks.

puter.ai.chat(
    "Write a Python function that implements binary search on a sorted array",
    { model: "openai/gpt-5.3-codex" }
)
.then(response => {
    puter.print(response);
});
Full code example:

<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        puter.ai.chat(
            "Write a Python function that implements binary search on a sorted array",
            { model: "openai/gpt-5.3-codex" }
        )
        .then(response => {
            puter.print(response);
        });
    </script>
</body>
</html>
Find more Codex examples in the Codex API tutorial.

List of supported text generation models
The following OpenAI models are supported by Puter.js, which can be used with the puter.ai.chat() function:

gpt-5.4
gpt-5.4-pro
gpt-5.3-chat
gpt-5.2
gpt-5.2-chat
gpt-5.2-pro
gpt-5.1
gpt-5.1-chat-latest
gpt-5.3-codex
gpt-5.2-codex
gpt-5.1-codex
gpt-5.1-codex-mini
gpt-5.1-codex-max
gpt-5-codex
gpt-5
gpt-5-mini
gpt-5-nano
gpt-5-chat-latest
gpt-4.1
gpt-4.1-mini
gpt-4.1-nano
gpt-4.5-preview
gpt-4o
gpt-4o-mini
o1
o1-mini
o1-pro
o3
o3-mini
o4-mini
List of supported image generation models
The following GPT Image models are supported by Puter.js, which can be used with the puter.ai.txt2img() function:

gpt-image-1.5
gpt-image-1-mini
gpt-image-1
dall-e-3
dall-e-2
List of supported text-to-speech models
The following OpenAI text-to-speech models are supported by Puter.js, which can be used with the puter.ai.txt2speech() function:

gpt-4o-mini-tts
tts-1
tts-1-hd
Conclusion
Using Puter.js, you can gain access to OpenAI models without having to set up an OpenAI developer account. And thanks to the User-Pays model, your users cover their own AI usage, not you as the developer. This means you can build powerful applications without worrying about AI usage costs.

You can find all AI features supported by Puter.js in the documentation.
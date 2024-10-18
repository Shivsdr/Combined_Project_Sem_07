// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductSearchStorage {

    // struct Review {
    //     string reviewText;
    // }

    struct Product {
        string title;
        string nextUrl;
        // Review[] reviews;
        string price;
        string link;
        string image_url;
    }

    struct Searches {
        string searchedTerm;
        Product[] products;
        uint256 timestamp; // Timestamp for the search
    }

    mapping(string => Searches) public searchResults; // Store searches by term
    uint256 public expirationTime = 24 hours; // Expiration time for search results

    event SearchAdded(string indexed searchedTerm);
    event SearchDeleted(string indexed searchedTerm);

    // Function to check if a search term exists and delete if expired
    function searchTermExists(string memory _searchedTerm) public returns (bool) {
        Searches storage search = searchResults[_searchedTerm];
        if (bytes(search.searchedTerm).length > 0) {
            if (block.timestamp > search.timestamp + expirationTime) {
                deleteExpiredSearch(_searchedTerm);
                return false; // Term was expired and deleted
            }
            return true; // Term exists and is valid
        }
        return false; // Term does not exist
    }

    // Function to add search results
    function addSearchResults(string memory _searchedTerm, Product[] memory _products) public {
        // Store the new search
        Searches storage newSearch = searchResults[_searchedTerm];

        newSearch.searchedTerm = _searchedTerm;
        newSearch.timestamp = block.timestamp;

        // Copy products from memory to storage
        for (uint256 i = 0; i < _products.length; i++) {
            Product storage product = newSearch.products.push();
            product.title = _products[i].title;
            product.nextUrl = _products[i].nextUrl;
            product.price = _products[i].price;
            product.link = _products[i].link;
            product.image_url = _products[i].image_url;

            // Copy reviews
            // for (uint256 j = 0; j < _products[i].reviews.length; j++) {
            //     product.reviews.push(Review(_products[i].reviews[j].reviewText));
            // }
        }

        emit SearchAdded(_searchedTerm);
    }

    // Function to get search results
    function getSearchResults(string memory _searchedTerm) public view returns (Product[] memory) {
        Searches storage search = searchResults[_searchedTerm];
        
        require(bytes(search.searchedTerm).length > 0, "Search term not found.");
        require(block.timestamp <= search.timestamp + expirationTime, "Search results have expired.");

        return search.products;
    }

    // Function to delete expired searches
    function deleteExpiredSearch(string memory _searchedTerm) internal {
        Searches storage search = searchResults[_searchedTerm];
        
        require(bytes(search.searchedTerm).length > 0, "Search term not found.");
        
        delete searchResults[_searchedTerm];
        emit SearchDeleted(_searchedTerm);
    }
}

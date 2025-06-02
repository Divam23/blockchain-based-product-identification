// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ProductRegistry {
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    struct Manufacturer {
        string name;
        string manufacturingLocation;
        string email;
        string phone;
        string facilityAddress;
        uint256 timestamp;
        bool isVerified;
        bool isFlagged;
        bool requestedVerification;
    }

    struct ProductDetails {
        string name;
        string description;
        string category;
        string batchNumber;
        string serialNumber;
        string uniqueProductId;
        string manufacturingDate;
        string expiryDate;
    }

    struct Product {
        ProductDetails details;
        address manufacturerAddress;
        bool isRegistered;
        uint256 scanCount;
    }

    mapping(address => Manufacturer) public manufacturers;
    mapping(string => Product) public products;
    mapping(address => string[]) private manufacturerProducts;

    address[] public allManufacturers;
    string[] public allProductIds;

    event ManufacturerRegistered(address manufacturerAddress, string name);
    event ProductRegistered(
        string uniqueProductId,
        string name,
        address manufacturerAddress
    );
    event ManufacturerVerified(address manufacturerAddress, bool status);
    event ManufacturerFlagged(address manufacturerAddress, bool status);
    event ProductScanned(string uniqueProductId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Manufacturer Registration
    function registerManufacturer(
        string memory _name,
        string memory _manufacturingLocation,
        string memory _email,
        string memory _phone,
        string memory _facilityAddress
    ) public {
        require(
            bytes(manufacturers[msg.sender].name).length == 0,
            "Already registered"
        );
        manufacturers[msg.sender] = Manufacturer(
            _name,
            _manufacturingLocation,
            _email,
            _phone,
            _facilityAddress,
            block.timestamp,
            false,
            false,
            false
        );
        allManufacturers.push(msg.sender);
        emit ManufacturerRegistered(msg.sender, _name);
    }

    // Admin verifies a manufacturer
    function verifyManufacturer(
        address manufacturerAddr,
        bool status
    ) public onlyAdmin {
        require(
            bytes(manufacturers[manufacturerAddr].name).length > 0,
            "Manufacturer not found"
        );
        manufacturers[manufacturerAddr].isVerified = status;
        if (status) {
            manufacturers[manufacturerAddr].requestedVerification = false;
        }
        emit ManufacturerVerified(manufacturerAddr, status);
    }

    // Admin flags a manufacturer
    function flagManufacturer(
        address manufacturerAddr,
        bool status
    ) public onlyAdmin {
        require(
            bytes(manufacturers[manufacturerAddr].name).length > 0,
            "Manufacturer not found"
        );
        manufacturers[manufacturerAddr].isFlagged = status;
        emit ManufacturerFlagged(manufacturerAddr, status);
    }

    function requestVerification() public {
        Manufacturer storage m = manufacturers[msg.sender];
        require(bytes(m.name).length > 0, "Manufacturer not registered");
        require(!m.isVerified, "Already verified");
        m.requestedVerification = true;
    }

    function getRequestedManufacturers()
        public
        view
        returns (address[] memory)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < allManufacturers.length; i++) {
            if (manufacturers[allManufacturers[i]].requestedVerification) {
                count++;
            }
        }

        address[] memory requested = new address[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < allManufacturers.length; i++) {
            if (manufacturers[allManufacturers[i]].requestedVerification) {
                requested[index++] = allManufacturers[i];
            }
        }

        return requested;
    }

    // Product Registration
function registerProduct(
    ProductDetails memory productDetails
) public {
    require(
        manufacturers[msg.sender].isVerified,
        "Only verified manufacturers can register products"
    );

    require(
        !products[productDetails.uniqueProductId].isRegistered,
        "Product already exists"
    );

    products[productDetails.uniqueProductId] = Product(
        productDetails,
        msg.sender,
        true,
        0
    );

    manufacturerProducts[msg.sender].push(productDetails.uniqueProductId);
    allProductIds.push(productDetails.uniqueProductId);

    emit ProductRegistered(
        productDetails.uniqueProductId,
        productDetails.name,
        msg.sender
    );
}

    // Increment scan count (to be called when a product is scanned)
    function scanProduct(string memory productId) public {
        require(products[productId].isRegistered, "Product not found");
        products[productId].scanCount += 1;
        emit ProductScanned(productId);
    }

    // View functions
    function getManufacturerProducts(
        address manufacturer
    ) public view returns (string[] memory) {
        return manufacturerProducts[manufacturer];
    }

    function getAllManufacturers() public view returns (address[] memory) {
        return allManufacturers;
    }

function getAllProducts() public view returns (Product[] memory) {
    Product[] memory all = new Product[](allProductIds.length);
    for (uint i = 0; i < allProductIds.length; i++) {
        all[i] = products[allProductIds[i]];
    }
    return all;
}


    function getStats()
        public
        view
        returns (
            uint256 totalManufacturers,
            uint256 verifiedCount,
            uint256 flaggedCount,
            uint256 totalProductsScanned
        )
    {
        uint256 verified = 0;
        uint256 flagged = 0;
        uint256 scanned = 0;

        for (uint256 i = 0; i < allManufacturers.length; i++) {
            Manufacturer memory m = manufacturers[allManufacturers[i]];
            if (m.isVerified) verified++;
            if (m.isFlagged) flagged++;
        }

        for (uint256 i = 0; i < allProductIds.length; i++) {
            scanned += products[allProductIds[i]].scanCount;
        }

        return (allManufacturers.length, verified, flagged, scanned);
    }
}
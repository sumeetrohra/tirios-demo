import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilter, FiArrowRight, FiTrendingUp, FiDollarSign } from 'react-icons/fi';
import { FaEthereum } from 'react-icons/fa';
import API from '../api/axios';

function Properties() {
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: 'all',
    propertyType: 'all',
    location: '',
    minROI: '',
    maxROI: '',
    fundingStatus: 'all',
    sortBy: 'newest'
  });

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params from filters
      const params = new URLSearchParams();
      if (filters.propertyType !== 'all') params.append('type', filters.propertyType);
      if (filters.location) params.append('location', filters.location);
      if (filters.minROI) params.append('minROI', filters.minROI);
      if (filters.maxROI) params.append('maxROI', filters.maxROI);
      if (filters.fundingStatus !== 'all') params.append('status', filters.fundingStatus);
      if (filters.sortBy !== 'newest') params.append('sortBy', filters.sortBy);

      if (filters.priceRange !== 'all') {
        const parts = filters.priceRange.split('-');
        if (parts[0]) params.append('priceMin', parts[0]);
        if (parts[1]) params.append('priceMax', parts[1]);
      }

      const res = await API.get(`/properties?${params.toString()}`);
      setProperties(res.data?.properties || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Header */}
      <div className="bg-white dark:bg-secondary-800 shadow">
        <div className="container py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Investment Properties</h1>
            <div className="flex items-center space-x-4">
              <button
                className={`p-2 rounded-md ${showFilters ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' : 'hover:bg-secondary-100'}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-secondary-800 shadow-md dark:shadow-secondary-900/50 border-t dark:border-secondary-700">
          <div className="container py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Price Range
                </label>
                <select
                  className="input"
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                >
                  <option value="all">All Prices</option>
                  <option value="0-500000">Under $500,000</option>
                  <option value="500000-1000000">$500,000 - $1,000,000</option>
                  <option value="1000000">Over $1,000,000</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Property Type
                </label>
                <select
                  className="input"
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Minimum ROI
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="Min ROI %"
                  value={filters.minROI}
                  onChange={(e) => handleFilterChange('minROI', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Funding Status
                </label>
                <select
                  className="input"
                  value={filters.fundingStatus}
                  onChange={(e) => handleFilterChange('fundingStatus', e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New Listings</option>
                  <option value="active">Active Funding</option>
                  <option value="almostFunded">Almost Funded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Sort By
                </label>
                <select
                  className="input"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="roiDesc">Highest ROI</option>
                  <option value="fundingDesc">Most Funded</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Properties Grid */}
      <div className="container py-8">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-r-transparent" />
            <p className="mt-4 text-secondary-600 dark:text-secondary-300">Loading properties...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-12 text-red-600">{error}</div>
        )}
        {!loading && !error && properties.length === 0 && (
          <div className="text-center py-12 text-secondary-600 dark:text-secondary-300">
            No properties found matching your filters.
          </div>
        )}
        {!loading && !error && properties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              className="bg-white dark:bg-secondary-800 rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/properties/${property.id}`}>
                <div className="relative h-48">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white dark:bg-secondary-800 px-3 py-1 rounded-full text-primary-600 font-semibold">
                    {property.status}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                  <p className="text-secondary-600 dark:text-secondary-300 mb-4">{property.location}</p>

                  {/* Price and ROI */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">Investment Price</p>
                      <div className="flex items-center">
                        <FiDollarSign className="text-primary-600" />
                        <span className="font-semibold">${property.price?.usd?.toLocaleString() ?? 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-sm text-primary-600">
                        <FaEthereum className="mr-1" />
                        <span>{property.price?.eth ?? 'N/A'} ETH</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">Annual ROI</p>
                      <div className="flex items-center justify-end text-green-600">
                        <FiTrendingUp className="mr-1" />
                        <span className="font-semibold">{property.roi ?? 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Investment Metrics */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600 dark:text-secondary-300">Monthly Income</span>
                      <span className="font-medium">{property.metrics?.monthlyIncome ?? 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600 dark:text-secondary-300">Appreciation</span>
                      <span className="font-medium">{property.metrics?.appreciation ?? 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600 dark:text-secondary-300">Min Investment</span>
                      <span className="font-medium">{property.metrics?.minInvestment ?? 'N/A'}</span>
                    </div>
                  </div>

                  {/* Funding Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-secondary-600 dark:text-secondary-300">Funding Progress</span>
                      <span className="font-medium">{property.metrics?.funded ?? 'N/A'}</span>
                    </div>
                    <div className="w-full bg-secondary-100 dark:bg-secondary-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: property.metrics?.funded || '0%' }}
                      />
                    </div>
                  </div>

                  {/* Token Details */}
                  <div className="bg-secondary-50 dark:bg-secondary-900 rounded-lg p-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600 dark:text-secondary-300">Available Tokens</span>
                      <span className="font-medium">
                        {property.tokenDetails?.availableTokens?.toLocaleString() ?? 'N/A'} / {property.tokenDetails?.totalTokens?.toLocaleString() ?? 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-secondary-600 dark:text-secondary-300">Token Price</span>
                      <span className="font-medium">{property.tokenDetails?.tokenPrice ?? 'N/A'}</span>
                    </div>
                  </div>

                  <button className="btn w-full flex items-center justify-center">
                    Invest Now
                    <FiArrowRight className="ml-2" />
                  </button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}

export default Properties;

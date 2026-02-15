import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiMaximize2, FiCalendar, FiTrendingUp, FiUsers, FiDollarSign, FiGrid } from 'react-icons/fi';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';
import { FaFacebook, FaTwitter, FaLinkedin, FaEthereum, FaWallet } from 'react-icons/fa';
import API from '../api/axios';
import PropertyModelViewer from '../components/property/PropertyModelViewer';

function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState('photos'); // 'photos' | '3d'

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/properties/${id}`);
        setProperty(res.data?.property || null);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const shareUrl = window.location.href;

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-r-transparent" />
          <p className="mt-4 text-secondary-600 dark:text-secondary-300">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Property not found'}</p>
          <Link to="/properties" className="btn mt-4 inline-block">Back to Properties</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Navigation */}
      <div className="bg-white dark:bg-secondary-800 shadow">
        <div className="container py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600">Home</Link>
            <span className="text-secondary-400 dark:text-secondary-500">/</span>
            <Link to="/properties" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600">Properties</Link>
            <span className="text-secondary-400 dark:text-secondary-500">/</span>
            <span className="text-primary-600">{property.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Photos / 3D tabs - visible when property has 3D model */}
              {property.model3d && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode('photos')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      viewMode === 'photos'
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-300 dark:hover:bg-secondary-600'
                    }`}
                  >
                    Photos
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('3d')}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                      viewMode === '3d'
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-300 dark:hover:bg-secondary-600'
                    }`}
                  >
                    <FiGrid />
                    3D Model
                  </button>
                </div>
              )}
              {/* Main display area */}
              <div className="h-96 rounded-lg overflow-hidden relative">
                {viewMode === '3d' && property.model3d ? (
                  <PropertyModelViewer modelUrl={property.model3d} className="h-full" />
                ) : (
                  <img
                    src={property.images?.[selectedImageIndex]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {/* Thumbnail strip: photos + 3D option */}
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {property.images?.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => { setSelectedImageIndex(index); setViewMode('photos'); }}
                    className={`h-32 rounded-lg overflow-hidden border-2 transition-colors ${
                      viewMode === 'photos' && selectedImageIndex === index
                        ? 'border-primary-600 ring-2 ring-primary-200 dark:ring-primary-800'
                        : 'border-transparent hover:border-secondary-300 dark:hover:border-secondary-600'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${property.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                {property.model3d && (
                  <button
                    type="button"
                    onClick={() => setViewMode('3d')}
                    className={`h-32 rounded-lg overflow-hidden border-2 flex flex-col items-center justify-center gap-2 bg-secondary-100 dark:bg-secondary-800 transition-colors ${
                      viewMode === '3d'
                        ? 'border-primary-600 ring-2 ring-primary-200 dark:ring-primary-800'
                        : 'border-transparent hover:border-secondary-300 dark:hover:border-secondary-600'
                    }`}
                  >
                    <FiGrid className="text-2xl text-primary-600" />
                    <span className="text-xs font-medium text-secondary-600 dark:text-secondary-300">3D Model</span>
                  </button>
                )}
              </div>
            </motion.div>

            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-bold mb-4">Property Details</h2>
              <p className="text-secondary-600 dark:text-secondary-300 mb-6">{property.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span>{property.parkingSpaces ?? 'N/A'} Parking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiMaximize2 className="text-primary-600" />
                  <span>{property.lotSize ?? 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCalendar className="text-primary-600" />
                  <span>Built {property.yearBuilt ?? 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiUsers className="text-primary-600" />
                  <span>{property.metrics?.totalInvestors ?? 'N/A'} Investors</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {(property.features || []).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <FiHome className="text-primary-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Token Details */}
              <h3 className="text-xl font-semibold mb-4">Token Information</h3>
              <div className="bg-secondary-50 dark:bg-secondary-900 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-300">Token Symbol</p>
                    <p className="font-semibold">{property.tokenDetails?.tokenSymbol ?? 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-300">Token Price</p>
                    <p className="font-semibold">{property.tokenDetails?.tokenPrice ?? 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-300">Available Tokens</p>
                    <p className="font-semibold">{property.tokenDetails?.availableTokens?.toLocaleString() ?? 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-300">Total Supply</p>
                    <p className="font-semibold">{property.tokenDetails?.totalTokens?.toLocaleString() ?? 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-secondary-600 dark:text-secondary-300">Smart Contract</p>
                    <p className="font-mono text-sm">{property.tokenDetails?.contractAddress ?? 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <h3 className="text-xl font-semibold mb-4">Financial Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-secondary-50 dark:bg-secondary-900 rounded-lg p-6">
                  <h4 className="font-semibold mb-4">Rental Income</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-secondary-600 dark:text-secondary-300">Gross Rent</span>
                      <span className="font-medium">{property.financials?.grossRent ?? 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600 dark:text-secondary-300">Net Rent</span>
                      <span className="font-medium">{property.financials?.netRent ?? 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-secondary-50 dark:bg-secondary-900 rounded-lg p-6">
                  <h4 className="font-semibold mb-4">Expenses</h4>
                  <div className="space-y-2">
                    {Object.entries(property.financials?.expenses || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-secondary-600 dark:text-secondary-300">{key.replace('_', ' ').charAt(0).toUpperCase() + key.slice(1)}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Investment Card */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">Investment Price</p>
                  <div className="flex items-center">
                    <FiDollarSign className="text-primary-600" />
                    <span className="text-2xl font-bold">${property.price?.usd?.toLocaleString() ?? 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-primary-600">
                    <FaEthereum className="mr-1" />
                    <span>{property.price?.eth ?? 'N/A'} ETH</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">Annual ROI</p>
                  <div className="flex items-center justify-end text-green-600">
                    <FiTrendingUp className="mr-1" />
                    <span className="text-2xl font-bold">{property.roi ?? 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Investment Metrics */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-secondary-300">Rental Yield</span>
                  <span className="font-medium">{property.metrics?.rentalYield ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-secondary-300">Appreciation</span>
                  <span className="font-medium">{property.metrics?.appreciation ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-secondary-300">Total Return</span>
                  <span className="font-medium text-green-600">{property.metrics?.totalReturn ?? 'N/A'}</span>
                </div>
              </div>

              {/* Funding Progress */}
              <div className="mb-6">
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
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                  Min Investment: {property.metrics?.minInvestment ?? 'N/A'}
                </p>
              </div>
              
              <Link
                to={`/property-3d`}
                className="btn w-full mb-4 flex items-center justify-center">
                <FiGrid className="mr-2" />
                View 3D version
              </Link>

              <button className="btn w-full mb-4 flex items-center justify-center">
                <FaWallet className="mr-2" />
                Connect Wallet to Invest
              </button>
              
              <div className="flex items-center justify-center space-x-4 pt-4 border-t dark:border-secondary-700">
                <FacebookShareButton url={shareUrl}>
                  <FaFacebook className="text-2xl text-blue-600 hover:opacity-80" />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl}>
                  <FaTwitter className="text-2xl text-sky-500 hover:opacity-80" />
                </TwitterShareButton>
                <LinkedinShareButton url={shareUrl}>
                  <FaLinkedin className="text-2xl text-blue-700 hover:opacity-80" />
                </LinkedinShareButton>
              </div>
            </div>

            {/* Agent Card */}
            {property.agent && (
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={property.agent?.image}
                  alt={property.agent?.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{property.agent?.name ?? 'N/A'}</h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-300">Investment Advisor</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Phone:</span> {property.agent?.phone ?? 'N/A'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {property.agent?.email ?? 'N/A'}
                </p>
              </div>
              <button className="btn-secondary w-full mt-4">
                Schedule Consultation
              </button>
            </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;

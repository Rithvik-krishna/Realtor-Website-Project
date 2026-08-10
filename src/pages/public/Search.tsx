import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import type { Property } from '../../context/AppContext';
import { GooglePropertyMap } from '../../components/GooglePropertyMap';
import { ShareModal } from '../../components/ShareModal';
import { MapPin, Grid, List, SlidersHorizontal, Heart, RefreshCw, X, ChevronDown, Share2, Eye, Map, Check, ChevronRight } from 'lucide-react';
import { SEOHead } from '../../components/seo/SEOHead';

const CITIES = [
  'All', 'Toronto', 'Mississauga', 'Brampton', 'Oakville', 'Milton', 'Vaughan', 'Markham', 
  'Richmond Hill', 'Scarborough', 'Etobicoke', 'Hamilton', 'Ajax', 'Pickering', 'Whitby', 
  'Burlington', 'Newmarket', 'Aurora', 'King', 'Caledon', 'Halton Hills', 'Oshawa', 
  'Clarington', 'Whitchurch-Stouffville', 'Georgina', 'Brock', 'Scugog', 'Uxbridge', 
  'Niagara', 'Barrie', 'Guelph', 'Kitchener', 'Waterloo', 'Yorkville', 'Forest Hill', 
  'The Bridle Path', 'Rosedale', 'Lawrence Park', 'Waterfront Toronto', 'High Park', 'The Annex'
];

const PROPERTY_TYPES = [
  { label: 'All Property Categories', value: 'All' },
  { label: '🏡 Detached Homes (Single Family)', value: 'Detached' },
  { label: '🏠 Semi-Detached Pair', value: 'Semi-Detached' },
  { label: '🏘️ Townhouses & Row Houses', value: 'Townhouse' },
  { label: '🏙️ Condo Apartments & Penthouses', value: 'Condo' },
  { label: '🌾 Bungalows & Split-Levels', value: 'Bungalow' },
  { label: '🌊 Luxury Waterfront & Alpine', value: 'Waterfront' },
  { label: '🏬 Commercial & Retail', value: 'Commercial' },
  { label: '🚜 Vacant Land & Farm', value: 'Land' }
];

const STATUS_OPTIONS = ['All', 'Active', 'Pending', 'Just Listed', 'Open House'];

export const Search: React.FC = () => {
  const { 
    properties, 
    savedProperties, 
    toggleSaveProperty, 
    setCurrentPage, 
    setSelectedPropertyId, 
    searchQuery, 
    setSearchQuery, 
    activeFilters,
    setActiveFilters,
    showToast,
    user,
    selectedMapMarkerId,
    setPendingPropertyAction,
    triggerRoleSwitchWarning,
    fetchNextPropertiesPage,
    hasNextPage,
    isFetchingNextPage
  } = useApp();

  // Screen Layout & View States
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileActiveTab, setMobileActiveTab] = useState<'map' | 'list'>('list');

  // Filter States initialized directly from AppContext Single Source of Truth
  // Normalize values defensively: 'Any' is a Home form value, 'All' is what Search uses internally
  const selectedCity = activeFilters.city || 'All';
  const setSelectedCity = (city: string) => setActiveFilters(prev => ({ ...prev, city }));

  // Normalize type: 'Any'→'All', 'House'→'Detached' (in case stale URL/cache values)
  const rawType = activeFilters.category !== 'All' ? activeFilters.category : (activeFilters.propertyType || 'All');
  const selectedType = rawType === 'Any' ? 'All' : rawType === 'House' ? 'Detached' : rawType;
  const setSelectedType = (category: string) => setActiveFilters(prev => ({ ...prev, category, propertyType: category }));

  // Normalize beds: 'Any'→'All'
  const rawBeds = activeFilters.beds || 'All';
  const bedsCount = rawBeds === 'Any' ? 'All' : rawBeds;
  const setBedsCount = (beds: string) => setActiveFilters(prev => ({ ...prev, beds }));

  // Normalize baths: 'Any'→'All'
  const rawBaths = activeFilters.baths || 'All';
  const bathsCount = rawBaths === 'Any' ? 'All' : rawBaths;
  const setBathsCount = (baths: string) => setActiveFilters(prev => ({ ...prev, baths }));

  const minPrice = activeFilters.priceRange ? activeFilters.priceRange[0] : 0;
  const maxPrice = activeFilters.priceRange ? activeFilters.priceRange[1] : 50000000;
  const setMaxPrice = (max: number) => setActiveFilters(prev => ({ ...prev, priceRange: [prev.priceRange ? prev.priceRange[0] : 0, max] }));

  // Derive status from activeFilters directly
  const selectedStatus = activeFilters.status || 'All';
  const setSelectedStatus = (status: string) => setActiveFilters(prev => ({ ...prev, status }));

  // Derive garage from activeFilters directly
  const selectedGarage = (activeFilters.showOnly || []).map(s => s.toLowerCase()).includes('garage') ? 'attached' : 'All';
  const setSelectedGarage = (val: string) => {
    setActiveFilters(prev => {
      const otherShowOnly = (prev.showOnly || []).filter(s => s.toLowerCase() !== 'garage');
      const showOnly = val !== 'All' ? [...otherShowOnly, 'garage'] : otherShowOnly;
      return { ...prev, showOnly };
    });
  };

  // Derive square footage from activeFilters directly
  const selectedSqft = 
    activeFilters.sqftMin === 0 && activeFilters.sqftMax === 1500 ? '< 1500' :
    activeFilters.sqftMin === 1500 && activeFilters.sqftMax === 3000 ? '1500 - 3000' :
    activeFilters.sqftMin === 3000 ? '3000+' : 'All';

  const setSelectedSqft = (val: string) => {
    setActiveFilters(prev => {
      let sqftMin: number | undefined = undefined;
      let sqftMax: number | undefined = undefined;
      if (val === '< 1500') {
        sqftMin = 0;
        sqftMax = 1500;
      } else if (val === '1500 - 3000') {
        sqftMin = 1500;
        sqftMax = 3000;
      } else if (val === '3000+') {
        sqftMin = 3000;
        sqftMax = 99999;
      }
      return { ...prev, sqftMin, sqftMax };
    });
  };

  // Derive boolean filters directly from activeFilters showOnly and schoolZone
  const openHouseOnly = (activeFilters.showOnly || []).map(s => s.toLowerCase()).includes('open house');
  const setOpenHouseOnly = (checked: boolean) => {
    setActiveFilters(prev => {
      const otherShowOnly = (prev.showOnly || []).filter(s => s.toLowerCase() !== 'open house');
      const showOnly = checked ? [...otherShowOnly, 'Open House'] : otherShowOnly;
      return { ...prev, showOnly };
    });
  };

  const luxuryOnly = (activeFilters.showOnly || []).map(s => s.toLowerCase()).includes('luxury');
  const setLuxuryOnly = (checked: boolean) => {
    setActiveFilters(prev => {
      const otherShowOnly = (prev.showOnly || []).filter(s => s.toLowerCase() !== 'luxury');
      const showOnly = checked ? [...otherShowOnly, 'Luxury'] : otherShowOnly;
      return { ...prev, showOnly };
    });
  };

  const schoolZoneFilter = !!activeFilters.schoolZone;
  const setSchoolZoneFilter = (checked: boolean) => setActiveFilters(prev => ({ ...prev, schoolZone: checked || undefined }));

  const transitFilter = (activeFilters.showOnly || []).map(s => s.toLowerCase()).includes('transit');
  const setTransitFilter = (checked: boolean) => {
    setActiveFilters(prev => {
      const otherShowOnly = (prev.showOnly || []).filter(s => s.toLowerCase() !== 'transit');
      const showOnly = checked ? [...otherShowOnly, 'transit'] : otherShowOnly;
      return { ...prev, showOnly };
    });
  };

  const [searchTerm, setSearchTerm] = useState(searchQuery || '');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc' | 'size' | 'newest'>('desc');

  // Modals
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [quickViewProperty, setQuickViewProperty] = useState<Property | null>(null);
  const [shareProperty, setShareProperty] = useState<Property | null>(null);

  // Map & Hover Synchronization
  const [mapHoveredId, setMapHoveredId] = useState<string | null>(null);
  const [mapActiveId, setMapActiveId] = useState<string | null>(selectedMapMarkerId);
  const [visiblePropertyIds, setVisiblePropertyIds] = useState<string[] | null>(null);

  const listPanelRef = useRef<HTMLDivElement>(null);

  // Infinite scroll listener attached directly to listPanelRef active scroll container
  useEffect(() => {
    const container = listPanelRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isFetchingNextPage || !hasNextPage) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - (scrollTop + clientHeight) <= 300) {
        fetchNextPropertiesPage();
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPropertiesPage]);

  // Synchronize search query and custom parameters from global state
  useEffect(() => {
    const activeText = searchQuery || activeFilters.address || activeFilters.postalCode || activeFilters.mlsNumber || '';
    if (activeText) {
      setSearchTerm(activeText);
      const clean = activeText.trim().toLowerCase();
      const matchedCity = CITIES.find(c => c !== 'All' && c.toLowerCase() === clean);
      if (matchedCity) {
        setSelectedCity(matchedCity);
      }
    }
  }, [searchQuery, activeFilters.address, activeFilters.postalCode, activeFilters.mlsNumber]);

  const activeSearchArea = useMemo(() => {
    if (selectedCity && selectedCity !== 'All') {
      return selectedCity;
    }
    if (searchTerm && searchTerm.trim().length > 0) {
      const clean = searchTerm.trim().toLowerCase();
      const matchedCity = CITIES.find(c => c !== 'All' && c.toLowerCase() === clean);
      if (matchedCity) return matchedCity;
      return searchTerm.trim().charAt(0).toUpperCase() + searchTerm.trim().slice(1);
    }
    return 'All';
  }, [selectedCity, searchTerm]);

  // Sync selection from map
  const handleSelectPropertyFromMap = (prop: Property) => {
    setMapActiveId(prop.id);
    setSelectedPropertyId(prop.id);
    
    // Scroll to matching property card on right side
    const cardEl = document.getElementById(`property-card-${prop.id}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // When map pans/zooms, update which properties are visible in the list
  const handleVisiblePropertiesChange = (ids: string[]) => {
    setVisiblePropertyIds(ids);
  };

  // Helper: Normalize city string to remove regional suffixes like ', Ontario', ', ON', '(C01)', etc.
  const cleanCityName = (str: string): string => {
    if (!str) return '';
    return str
      .replace(/,\s*(ontario|on|canada|ca).*/i, '')
      .replace(/\s*\([^)]*\)/g, '')
      .trim()
      .toLowerCase();
  };

  // Helper: City matching with fuzzy/normalized support
  const matchCity = (prop: Property, targetCity: string): boolean => {
    if (!targetCity || targetCity === 'All' || targetCity === 'Any') return true;
    const cleanTarget = cleanCityName(targetCity);
    if (!cleanTarget) return true;

    const propCity = cleanCityName(prop.city);
    const propAddress = (prop.address || '').toLowerCase();
    const propTitle = (prop.title || '').toLowerCase();

    return (
      propCity === cleanTarget ||
      propCity.includes(cleanTarget) ||
      cleanTarget.includes(propCity) ||
      propAddress.includes(cleanTarget) ||
      propTitle.includes(cleanTarget)
    );
  };

  // Helper: Property Type matching
  const matchType = (prop: Property, targetType: string): boolean => {
    if (!targetType || targetType === 'All' || targetType === 'Any') return true;

    const subType = ((prop as any).propertySubType || '').toLowerCase();
    const type = (prop.propertyType || '').toLowerCase();
    const title = (prop.title || '').toLowerCase();
    const category = (prop.category || '').toLowerCase();
    const typeString = `${type} ${subType} ${title} ${category}`;

    const isLand = /land|vacant|farm|rural/i.test(typeString);
    const isCommercial = /commercial|office|retail|store|industrial|warehouse/i.test(typeString);
    const isCondo = /condo|apartment|penthouse/i.test(typeString);
    const isTownhouse = /townhouse|row house|twnhouse|row/i.test(typeString);
    const isSemi = /semi/i.test(typeString);
    const isBungalow = /bungalow|split/i.test(typeString);
    const isWaterfront = /waterfront|alpine|lake|river|chalet/i.test(typeString) || category.includes('waterfront') || category.includes('alpine');
    const isDetached = /detached|single family|single-family/i.test(typeString) || (!isLand && !isCommercial && !isCondo && !isTownhouse && !isSemi && ((prop.beds || 0) > 0));

    if (targetType === 'Detached') return isDetached;
    if (targetType === 'Semi-Detached' || targetType === 'Semi') return isSemi;
    if (targetType === 'Townhouse') return isTownhouse;
    if (targetType === 'Condo') return isCondo;
    if (targetType === 'Bungalow') return isBungalow;
    if (targetType === 'Waterfront') return isWaterfront;
    if (targetType === 'Commercial') return isCommercial;
    if (targetType === 'Land') return isLand;

    return type.includes(targetType.toLowerCase()) || subType.includes(targetType.toLowerCase());
  };

  // Helper: Beds matching (minimum count, not exact)
  const matchBeds = (prop: Property, bedsSetting: string): boolean => {
    if (!bedsSetting || bedsSetting === 'All' || bedsSetting === 'Any') return true;
    const numBeds = typeof prop.beds === 'number' ? prop.beds : (typeof (prop as any).bedrooms === 'number' ? (prop as any).bedrooms : 0);
    if (bedsSetting === '1') return numBeds >= 1;
    if (bedsSetting === '2') return numBeds >= 2;
    if (bedsSetting === '3') return numBeds >= 3;
    if (bedsSetting === '4' || bedsSetting === '4+') return numBeds >= 4;
    const parsed = parseInt(bedsSetting, 10);
    return !isNaN(parsed) ? numBeds >= parsed : true;
  };

  // Helper: Baths matching (minimum count)
  const matchBaths = (prop: Property, bathsSetting: string): boolean => {
    if (!bathsSetting || bathsSetting === 'All' || bathsSetting === 'Any') return true;
    const numBaths = typeof prop.baths === 'number' ? prop.baths : (typeof (prop as any).bathrooms === 'number' ? (prop as any).bathrooms : 0);
    if (bathsSetting === '1') return numBaths >= 1;
    if (bathsSetting === '2') return numBaths >= 2;
    if (bathsSetting === '3' || bathsSetting === '3+') return numBaths >= 3;
    const parsed = parseInt(bathsSetting, 10);
    return !isNaN(parsed) ? numBaths >= parsed : true;
  };

  // Helper: Text Search matching (clean input term of location suffixes like ', Ontario')
  /*
  const matchSearch = (prop: Property, term: string): boolean => {
    if (!term || !term.trim()) return true;
    const cleanTerm = cleanCityName(term);
    const rawTermLower = term.trim().toLowerCase();

    const propTitle = (prop.title || '').toLowerCase();
    const propAddress = (prop.address || '').toLowerCase();
    const propCity = cleanCityName(prop.city);
    const propMls = (prop.mlsNumber || '').toLowerCase();

    return (
      propTitle.includes(rawTermLower) ||
      propAddress.includes(rawTermLower) ||
      propMls.includes(rawTermLower) ||
      (cleanTerm ? propCity.includes(cleanTerm) || propTitle.includes(cleanTerm) || propAddress.includes(cleanTerm) : false)
    );
  };
  */

  // Filters pipeline logic
  const filteredProperties = properties.filter(prop => {
    const matchesType = matchType(prop, selectedType);
    const matchesBeds = matchBeds(prop, bedsCount);
    const matchesBaths = matchBaths(prop, bathsCount);
    const matchesMinPrice = prop.price >= minPrice;
    const matchesMaxPrice = prop.price <= maxPrice;
    const matchesGarage = selectedGarage === 'All' || (prop.garage && prop.garage.toLowerCase().includes(selectedGarage.toLowerCase()));
    const matchesSqftDefault = selectedSqft === 'All' ||
                        (selectedSqft === '< 1500' && prop.sqft < 1500) ||
                        (selectedSqft === '1500 - 3000' && prop.sqft >= 1500 && prop.sqft <= 3000) ||
                        (selectedSqft === '3000+' && prop.sqft > 3000);
    const matchesStatusDefault = selectedStatus === 'All' || !!(prop.propertyStatus && prop.propertyStatus.toLowerCase() === selectedStatus.toLowerCase());
    const matchesOpenHouse = !openHouseOnly || !!prop.openHouse;
    const matchesLuxury = !luxuryOnly || prop.price >= 3000000;
    const matchesTransit = !transitFilter || prop.features.some(f => f.toLowerCase().includes('transit') || f.toLowerCase().includes('subway'));

    // 1. Property Class Filter
    let matchesPropertyClass = true;
    if (activeFilters.propertyClass && activeFilters.propertyClass !== 'All') {
      const cls = activeFilters.propertyClass.toLowerCase();
      matchesPropertyClass = 
        (prop.estateClassification || '').toLowerCase().includes(cls) ||
        (prop.propertyType || '').toLowerCase().includes(cls) ||
        (prop.category || '').toLowerCase().includes(cls);
    }

    // 2. Home Type Filter
    let matchesHomeType = true;
    if (activeFilters.homeType && activeFilters.homeType !== 'All') {
      const ht = activeFilters.homeType.toLowerCase();
      matchesHomeType = 
        (prop.propertyType || '').toLowerCase().includes(ht) ||
        (prop.title || '').toLowerCase().includes(ht) ||
        (prop.propertySubType || '').toLowerCase().includes(ht);
    }

    // 3. Status Filter
    let matchesStatus = true;
    if (activeFilters.status && activeFilters.status !== 'All') {
      const st = activeFilters.status.toLowerCase();
      matchesStatus = 
        (prop.propertyStatus || '').toLowerCase() === st ||
        (prop.propertyStatus || '').toLowerCase().replace(/\s+/g, '') === st.replace(/\s+/g, '');
    } else {
      matchesStatus = matchesStatusDefault;
    }

    // 4. Square Footage Range Filter
    let matchesSqft = matchesSqftDefault;
    if (activeFilters.sqftMin !== undefined || activeFilters.sqftMax !== undefined) {
      const minSq = activeFilters.sqftMin || 0;
      const maxSq = activeFilters.sqftMax || 99999;
      matchesSqft = prop.sqft >= minSq && prop.sqft <= maxSq;
    }

    // 5. Days On Market Filter
    let matchesDOM = true;
    if (activeFilters.daysOnMarket && activeFilters.daysOnMarket !== 'Any') {
      const dom = activeFilters.daysOnMarket.toLowerCase();
      const domDays = prop.daysOnMarket || 0;
      if (dom.includes('1 day')) matchesDOM = domDays <= 1;
      else if (dom.includes('7 days')) matchesDOM = domDays <= 7;
      else if (dom.includes('14 days')) matchesDOM = domDays <= 14;
      else if (dom.includes('30 days')) matchesDOM = domDays <= 30;
      else if (dom.includes('90 days')) matchesDOM = domDays <= 90;
    }

    // 6. Show Only Multi-select Badge Filter
    let matchesShowOnly = true;
    if (activeFilters.showOnly && activeFilters.showOnly.length > 0) {
      matchesShowOnly = activeFilters.showOnly.every(criteria => {
        const crit = criteria.toLowerCase();
        if (crit === 'open house') return !!prop.openHouse;
        if (crit === 'new listings') return (prop.daysOnMarket || 0) <= 7;
        if (crit === 'price reduced') return (prop.priceDrop || 0) > 0;
        if (crit === 'waterfront') {
          return (
            (prop.category || '').toLowerCase() === 'waterfront' ||
            prop.title.toLowerCase().includes('waterfront') ||
            prop.features.some(f => f.toLowerCase().includes('waterfront') || f.toLowerCase().includes('lake'))
          );
        }
        if (crit === 'luxury') return prop.price >= 3000000;
        if (crit === 'swimming pool') {
          return prop.features.some(f => f.toLowerCase().includes('pool') || f.toLowerCase().includes('swimming'));
        }
        if (crit === 'garage') {
          return (prop.garage && prop.garage.toLowerCase() !== 'none') || prop.features.some(f => f.toLowerCase().includes('garage'));
        }
        if (crit === 'basement') {
          return (prop.basement && prop.basement.toLowerCase() !== 'none') || prop.features.some(f => f.toLowerCase().includes('basement'));
        }
        if (crit === 'pet friendly') {
          return prop.features.some(f => f.toLowerCase().includes('pet') || f.toLowerCase().includes('dog') || f.toLowerCase().includes('cat'));
        }
        return true;
      });
    }

    // 7. Keywords Search Filter
    let matchesKeywords = true;
    if (activeFilters.keywords) {
      const kw = activeFilters.keywords.toLowerCase().trim();
      matchesKeywords = 
        (prop.title || '').toLowerCase().includes(kw) ||
        (prop.address || '').toLowerCase().includes(kw) ||
        (prop.description || '').toLowerCase().includes(kw) ||
        prop.features.some(f => f.toLowerCase().includes(kw));
    }

    // Advanced search mode matching
    let matchesSearch = true;
    const searchVal = searchTerm.trim().toLowerCase();
    const currentSearchType = activeFilters.searchType || 'all';

    if (searchVal) {
      if (currentSearchType === 'all') {
        const titleMatch = (prop.title || '').toLowerCase().includes(searchVal);
        const cityMatch = (prop.city || '').toLowerCase().includes(searchVal);
        const communityMatch = (((prop as any).community) || prop.location || '').toLowerCase().includes(searchVal);
        const addressMatch = (prop.address || '').toLowerCase().includes(searchVal);
        const mlsMatch = (prop.mlsNumber || '').toLowerCase().includes(searchVal);
        matchesSearch = titleMatch || cityMatch || communityMatch || addressMatch || mlsMatch;
      } else if (currentSearchType === 'city') {
        matchesSearch = (prop.city || '').toLowerCase().includes(searchVal);
      } else if (currentSearchType === 'neighbourhood') {
        matchesSearch = (((prop as any).community) || prop.location || '').toLowerCase().includes(searchVal);
      } else if (currentSearchType === 'address') {
        matchesSearch = (prop.address || '').toLowerCase().includes(searchVal);
      } else if (currentSearchType === 'mls') {
        matchesSearch = (prop.mlsNumber || '').toLowerCase().includes(searchVal);
      } else if (currentSearchType === 'school') {
        const hasSchoolFeature = prop.features.some(f => f.toLowerCase().includes('school') || f.toLowerCase().includes('academy'));
        const schoolScoreMatch = prop.schoolScore && prop.schoolScore >= 7;
        const matchesQuery = prop.description?.toLowerCase().includes(searchVal) || prop.title?.toLowerCase().includes(searchVal) || prop.address?.toLowerCase().includes(searchVal);
        matchesSearch = !!((hasSchoolFeature || schoolScoreMatch) || matchesQuery);
      } else if (currentSearchType === 'postalCode') {
        matchesSearch = (prop.postalCode || '').toLowerCase().replace(/\s+/g, '').includes(searchVal.replace(/\s+/g, ''));
      }
    } else {
      if (activeFilters.city && activeFilters.city !== 'All') {
        matchesSearch = matchesSearch && matchCity(prop, activeFilters.city);
      }
      if (activeFilters.postalCode) {
        matchesSearch = matchesSearch && (prop.postalCode || '').toLowerCase().replace(/\s+/g, '').includes(activeFilters.postalCode.toLowerCase().replace(/\s+/g, ''));
      }
      if (activeFilters.mlsNumber) {
        matchesSearch = matchesSearch && (prop.mlsNumber || '').toLowerCase().includes(activeFilters.mlsNumber.toLowerCase());
      }
      if (activeFilters.address) {
        matchesSearch = matchesSearch && (prop.address || '').toLowerCase().includes(activeFilters.address.toLowerCase());
      }
      if (activeFilters.schoolZone) {
        matchesSearch = matchesSearch && !!(prop.schoolScore && prop.schoolScore >= 8);
      }
    }

    const matchesCity = activeFilters.city && activeFilters.city !== 'All' && currentSearchType !== 'city' ? matchCity(prop, selectedCity) : true;
    const matchesSchoolFilter = !schoolZoneFilter || !!(prop.schoolScore && prop.schoolScore >= 8);

    return (
      matchesCity && 
      matchesType && 
      matchesBeds && 
      matchesBaths && 
      matchesMinPrice && 
      matchesMaxPrice && 
      matchesGarage && 
      matchesSqft && 
      matchesStatus && 
      matchesOpenHouse && 
      matchesLuxury && 
      matchesTransit && 
      matchesSearch && 
      matchesSchoolFilter &&
      matchesPropertyClass &&
      matchesHomeType &&
      matchesDOM &&
      matchesShowOnly &&
      matchesKeywords
    );
  }).sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price;
    if (sortOrder === 'desc') return b.price - a.price;
    if (sortOrder === 'size') return b.sqft - a.sqft;
    if (sortOrder === 'newest') return (a.daysOnMarket || 1) - (b.daysOnMarket || 1);
    return 0;
  });

  // Step 12 Debug Logger: Log step-by-step filter counts when active
  useEffect(() => {
    if (properties.length > 0) {
      const cityCount = properties.filter(p => matchCity(p, selectedCity)).length;
      const typeCount = properties.filter(p => matchCity(p, selectedCity) && matchType(p, selectedType)).length;
      const bedsCountNum = properties.filter(p => matchCity(p, selectedCity) && matchType(p, selectedType) && matchBeds(p, bedsCount)).length;
      const priceCountNum = properties.filter(p => matchCity(p, selectedCity) && matchType(p, selectedType) && matchBeds(p, bedsCount) && p.price >= minPrice && p.price <= maxPrice).length;

      console.log(`🔍 [Search Pipeline Debug]
        Total Properties Fetched: ${properties.length}
        Active Parameters: City="${selectedCity}", Type="${selectedType}", Beds="${bedsCount}", Price=[${minPrice}, ${maxPrice}], SearchTerm="${searchTerm}"
        1. After City Filter: ${cityCount}
        2. After Type Filter: ${typeCount}
        3. After Beds Filter: ${bedsCountNum}
        4. After Price Filter: ${priceCountNum}
        Final Filtered Count: ${filteredProperties.length}`);
    }
  }, [properties.length, selectedCity, selectedType, bedsCount, minPrice, maxPrice, searchTerm, filteredProperties.length]);

  // Only filter by visible map viewport IDs if visiblePropertyIds is non-empty.
  // If visiblePropertyIds is empty (e.g. map initializing or centered away from listings), show all filteredProperties so results are never wiped out to 0.
  const displayedProperties = (visiblePropertyIds !== null && visiblePropertyIds.length > 0)
    ? filteredProperties.filter(p => visiblePropertyIds.includes(p.id))
    : filteredProperties;

  const resetFilters = () => {
    setActiveFilters({
      city: 'All',
      beds: 'All',
      baths: 'All',
      category: 'All',
      propertyType: 'All',
      priceRange: [0, 50000000],
      address: undefined,
      searchType: undefined,
      schoolZone: undefined,
      postalCode: undefined,
      mlsNumber: undefined,
      showOnly: [],
      status: 'All',
      sqftMin: undefined,
      sqftMax: undefined
    });
    setSearchTerm('');
    setSearchQuery('');

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('trreb_active_filters_cache');
      window.history.replaceState(null, '', window.location.pathname);
    }
    showToast('Filters reset to default.', 'info');
  };

  const handleOpenPropertyDetail = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedPropertyId(id);
    setCurrentPage('property-detail');
  };

  const handleSaveProperty = (prop: Property, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setPendingPropertyAction({
        type: 'save',
        propertyId: prop.id,
        propertyTitle: prop.title
      });
      showToast('Please sign in as a Buyer to save properties.', 'info');
      setCurrentPage('auth');
    } else if (user.role !== 'buyer') {
      triggerRoleSwitchWarning('buyer', 'search');
    } else {
      toggleSaveProperty(prop.id);
    }
  };

  const isFilteredSearch = selectedCity !== 'All' || selectedType !== 'All' || bedsCount !== 'All' || searchTerm.trim() !== '';
  const searchTitle = isFilteredSearch 
    ? `${selectedType !== 'All' ? selectedType : 'Homes'} for Sale in ${selectedCity !== 'All' ? selectedCity : 'Ontario'} | TRREB MLS® Listings`
    : `MLS® Property Search | Homes & Condos for Sale in Greater Toronto & Ontario`;

  const searchDesc = `Browse live TRREB MLS® property listings in ${selectedCity !== 'All' ? selectedCity : 'Ontario'}. Filter by price, bedrooms, property type, and neighborhood with Karan Kang, REALTOR®.`;

  const hasExtraFilterParams = sortOrder !== 'asc' || (activeFilters.status && activeFilters.status !== 'All') || minPrice > 0 || maxPrice < 50000000;

  return (
    <div style={{ height: 'calc(100vh - 72px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#ffffff' }}>
      <SEOHead
        title={searchTitle}
        description={searchDesc}
        canonicalPath={selectedCity !== 'All' ? `/properties/${selectedCity.toLowerCase()}` : '/search'}
        keywords={[`${selectedCity} real estate`, `homes for sale ${selectedCity}`, `MLS search Ontario`]}
        noIndex={hasExtraFilterParams}
      />
      
      {/* 1. TOP HORIZONTAL FILTERS BAR */}
      <div
        className="glass-panel"
        style={{
          padding: '10px 20px',
          borderBottom: '1px solid #e2e8f0',
          background: '#ffffff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          zIndex: 30,
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* Location Search Input */}
          <div style={{ minWidth: '180px', flex: 1 }}>
            <input
              type="text"
              placeholder="City, Neighborhood, Address, MLS#..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '6px 12px',
                color: '#0f172a',
                fontWeight: 600,
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
          </div>

          {/* City Selector */}
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '6px 10px',
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {CITIES.map(c => <option key={c} value={c} style={{ background: '#ffffff', color: '#0f172a' }}>City: {c}</option>)}
          </select>

          {/* Property Type */}
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '6px 10px',
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {PROPERTY_TYPES.map(t => (
              <option key={t.value} value={t.value} style={{ background: '#ffffff', color: '#0f172a' }}>
                Type: {t.label}
              </option>
            ))}
          </select>

          {/* Price Range Selectors */}
          <select
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '6px 10px',
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value={50000000} style={{ background: '#ffffff', color: '#0f172a' }}>Price: Any</option>
            <option value={1000000} style={{ background: '#ffffff', color: '#0f172a' }}>Under $1.0M</option>
            <option value={2000000} style={{ background: '#ffffff', color: '#0f172a' }}>Under $2.0M</option>
            <option value={3000000} style={{ background: '#ffffff', color: '#0f172a' }}>Under $3.0M</option>
            <option value={5000000} style={{ background: '#ffffff', color: '#0f172a' }}>Under $5.0M</option>
            <option value={10000000} style={{ background: '#ffffff', color: '#0f172a' }}>Under $10.0M</option>
          </select>

          {/* Bedrooms */}
          <select
            value={bedsCount}
            onChange={e => setBedsCount(e.target.value)}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '6px 10px',
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All" style={{ background: '#ffffff', color: '#0f172a' }}>Beds: Any</option>
            <option value="1+" style={{ background: '#ffffff', color: '#0f172a' }}>1+ Beds</option>
            <option value="2+" style={{ background: '#ffffff', color: '#0f172a' }}>2+ Beds</option>
            <option value="3+" style={{ background: '#ffffff', color: '#0f172a' }}>3+ Beds</option>
            <option value="4+" style={{ background: '#ffffff', color: '#0f172a' }}>4+ Beds</option>
          </select>

          {/* Advanced Filters Button */}
          <button
            onClick={() => setIsAdvancedOpen(prev => !prev)}
            className="btn btn-secondary hover-lift"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderColor: isAdvancedOpen ? '#0f172a' : '#cbd5e1',
              color: '#0f172a',
              background: isAdvancedOpen ? '#f1f5f9' : '#ffffff'
            }}
          >
            <SlidersHorizontal size={13} />
            <span>More Filters</span>
            <ChevronDown size={11} />
          </button>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginLeft: 'auto'
            }}
          >
            <RefreshCw size={11} />
            <span>Reset</span>
          </button>

        </div>

        {/* EXPANDED ADVANCED FILTERS PANEL */}
        {isAdvancedOpen && (
          <div
            className="glass-panel"
            style={{
              marginTop: '10px',
              padding: '16px',
              borderRadius: '12px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '14px'
            }}
          >
            {/* Bathrooms */}
            <div>
              <label style={{ fontSize: '0.72rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '4px' }}>BATHROOMS</label>
              <select
                value={bathsCount}
                onChange={e => setBathsCount(e.target.value)}
                style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: 600, padding: '6px', borderRadius: '6px', fontSize: '0.8rem' }}
              >
                <option value="All" style={{ background: '#ffffff', color: '#0f172a' }}>Any Bathrooms</option>
                <option value="1+" style={{ background: '#ffffff', color: '#0f172a' }}>1+ Baths</option>
                <option value="2+" style={{ background: '#ffffff', color: '#0f172a' }}>2+ Baths</option>
                <option value="3+" style={{ background: '#ffffff', color: '#0f172a' }}>3+ Baths</option>
              </select>
            </div>

            {/* Garage */}
            <div>
              <label style={{ fontSize: '0.72rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '4px' }}>GARAGE TYPE</label>
              <select
                value={selectedGarage}
                onChange={e => setSelectedGarage(e.target.value)}
                style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: 600, padding: '6px', borderRadius: '6px', fontSize: '0.8rem' }}
              >
                <option value="All" style={{ background: '#ffffff', color: '#0f172a' }}>Any Garage</option>
                <option value="attached" style={{ background: '#ffffff', color: '#0f172a' }}>Attached Garage</option>
                <option value="detached" style={{ background: '#ffffff', color: '#0f172a' }}>Detached Garage</option>
              </select>
            </div>

            {/* Square Feet */}
            <div>
              <label style={{ fontSize: '0.72rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '4px' }}>SQUARE FEET</label>
              <select
                value={selectedSqft}
                onChange={e => setSelectedSqft(e.target.value)}
                style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: 600, padding: '6px', borderRadius: '6px', fontSize: '0.8rem' }}
              >
                <option value="All" style={{ background: '#ffffff', color: '#0f172a' }}>Any Size</option>
                <option value="< 1500" style={{ background: '#ffffff', color: '#0f172a' }}>Under 1,500 SqFt</option>
                <option value="1500 - 3000" style={{ background: '#ffffff', color: '#0f172a' }}>1,500 - 3,000 SqFt</option>
                <option value="3000+" style={{ background: '#ffffff', color: '#0f172a' }}>3,000+ SqFt</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label style={{ fontSize: '0.72rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '4px' }}>LISTING STATUS</label>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: 600, padding: '6px', borderRadius: '6px', fontSize: '0.8rem' }}
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ background: '#ffffff', color: '#0f172a' }}>{s}</option>)}
              </select>
            </div>

            {/* Toggles Cluster */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
              <label style={{ fontSize: '0.78rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={openHouseOnly} onChange={e => setOpenHouseOnly(e.target.checked)} />
                <span>Open House Only</span>
              </label>
              <label style={{ fontSize: '0.78rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={luxuryOnly} onChange={e => setLuxuryOnly(e.target.checked)} />
                <span>Luxury Collection ($3M+)</span>
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
              <label style={{ fontSize: '0.78rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={schoolZoneFilter} onChange={e => setSchoolZoneFilter(e.target.checked)} />
                <span>Top School Zone (8+)</span>
              </label>
              <label style={{ fontSize: '0.78rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={transitFilter} onChange={e => setTransitFilter(e.target.checked)} />
                <span>Near Transit / Subway</span>
              </label>
            </div>

          </div>
        )}
      </div>

      {/* 2. MAIN SPLIT SCREEN LAYOUT */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        
        {/* LEFT PANEL: INTERACTIVE GOOGLE MAP (42% Width on Desktop) */}
        <div
          className="search-map-panel"
          style={{
            width: '42%',
            height: '100%',
            position: 'relative',
            borderRight: '1px solid #e2e8f0',
            display: mobileActiveTab === 'map' ? 'block' : undefined
          }}
        >
          <GooglePropertyMap
            properties={filteredProperties}
            selectedPropertyId={mapActiveId}
            hoveredPropertyId={mapHoveredId}
            onSelectProperty={handleSelectPropertyFromMap}
            onHoverProperty={setMapHoveredId}
            searchCity={selectedCity}
            onVisiblePropertiesChange={handleVisiblePropertiesChange}
          />
        </div>

        {/* RIGHT PANEL: SCROLLABLE PROPERTY RESULTS (58% Width on Desktop) */}
        <div
          ref={listPanelRef}
          className="search-results-panel"
          style={{
            width: '58%',
            height: '100%',
            overflowY: 'auto',
            padding: '16px 20px',
            background: '#ffffff',
            display: mobileActiveTab === 'list' ? 'flex' : undefined,
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Header Summary & Sort Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {displayedProperties.length.toLocaleString()} {displayedProperties.length === 1 ? 'Property' : 'Properties'}{visiblePropertyIds !== null && displayedProperties.length !== filteredProperties.length ? <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#E31837', marginLeft: '8px' }}>in map view</span> : ' Found'}
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#475569', margin: '2px 0 0 0' }}>
                Search Area: <span style={{ color: '#0f172a', fontWeight: 700 }}>{activeSearchArea}, Ontario</span>
                {visiblePropertyIds !== null && displayedProperties.length !== filteredProperties.length && (
                  <span style={{ color: '#64748b', marginLeft: '6px' }}>· Zoom out to see all {filteredProperties.length}</span>
                )}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Grid / List View Toggle */}
              <div style={{ display: 'flex', background: '#f8fafc', borderRadius: '8px', padding: '2px', border: '1px solid #cbd5e1' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: viewMode === 'grid' ? '#0f172a' : 'none',
                    color: viewMode === 'grid' ? '#ffffff' : '#475569',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Grid View"
                >
                  <Grid size={14} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: viewMode === 'list' ? '#0f172a' : 'none',
                    color: viewMode === 'list' ? '#ffffff' : '#475569',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="List View"
                >
                  <List size={14} />
                </button>
              </div>

              {/* Sort By Dropdown */}
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as any)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  color: '#0f172a',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="desc" style={{ background: '#ffffff', color: '#0f172a' }}>Price: High to Low</option>
                <option value="asc" style={{ background: '#ffffff', color: '#0f172a' }}>Price: Low to High</option>
                <option value="newest" style={{ background: '#ffffff', color: '#0f172a' }}>Newest Listed</option>
                <option value="size" style={{ background: '#ffffff', color: '#0f172a' }}>Largest Square Feet</option>
              </select>
            </div>
          </div>

          {/* PROPERTY CARDS GRID */}
          {displayedProperties.length === 0 ? (
            <div className="glass-panel" style={{ padding: '50px 24px', textAlign: 'center', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', margin: '20px 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '1px solid #cbd5e1' }}>
                <MapPin size={28} style={{ color: '#0f172a' }} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                No matching properties found
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', maxWidth: '480px', margin: '0 auto 20px auto', lineHeight: '1.6' }}>
                We currently don't have active listings matching all your selected parameters. Try resetting your advanced filters to explore the entire premium inventory.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    setSelectedCity('All');
                    setSelectedType('All');
                    setBedsCount('All');
                    setBathsCount('All');
                    setSearchTerm('');
                    setSearchQuery('');
                    setActiveFilters({
                      city: 'All',
                      beds: 'All',
                      baths: 'All',
                      category: 'All',
                      propertyType: 'All',
                      priceRange: [0, 50000000]
                    });
                    setVisiblePropertyIds(null);
                    showToast('All filters have been fully reset.', 'success');
                  }}
                  className="btn btn-primary hover-lift"
                  style={{ padding: '10px 24px', fontSize: '0.88rem', fontWeight: 700, background: '#0f172a', color: '#ffffff', borderRadius: '10px' }}
                >
                  Clear &amp; Reset Filters
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(260px, 1fr))' : '1fr',
                gap: '16px'
              }}
            >
              {displayedProperties.map(prop => {
                const isHovered = mapHoveredId === prop.id;
                const isSelected = mapActiveId === prop.id;
                const isBlinking = isHovered || isSelected;
                const isSaved = savedProperties.includes(prop.id);

                return (
                  <div
                    key={prop.id}
                    id={`property-card-${prop.id}`}
                    onMouseEnter={() => setMapHoveredId(prop.id)}
                    onMouseLeave={() => setMapHoveredId(null)}
                    onClick={() => handleSelectPropertyFromMap(prop)}
                    className={isBlinking ? "glass-panel card-hover-blinking" : "glass-panel hover-lift"}
                    style={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: `1px solid ${isSelected ? '#0f172a' : '#e2e8f0'}`,
                      background: isSelected ? '#f1f5f9' : '#ffffff',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
                      display: 'flex',
                      flexDirection: viewMode === 'list' ? 'row' : 'column',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    {/* Property Image */}
                    <div style={{ height: viewMode === 'list' ? '180px' : '170px', width: viewMode === 'list' ? '240px' : '100%', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                      <img
                        src={prop.imageUrl}
                        alt={prop.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      
                      {/* Status Badge */}
                      <span
                        className="badge"
                        style={{ position: 'absolute', top: '10px', left: '10px', background: '#0f172a', color: '#ffffff', fontSize: '0.65rem', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}
                      >
                        {prop.propertyStatus || 'Active'}
                      </span>

                      {/* Action Buttons Overlay */}
                      <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setQuickViewProperty(prop); }}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.9)',
                            border: '1px solid #cbd5e1',
                            color: '#0f172a',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(4px)'
                          }}
                          className="hover-lift"
                          title="Quick View"
                        >
                          <Eye size={12} />
                        </button>

                        <button
                          onClick={(e) => { e.stopPropagation(); setShareProperty(prop); }}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.9)',
                            border: '1px solid #cbd5e1',
                            color: '#0f172a',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(4px)'
                          }}
                          className="hover-lift"
                          title="Share"
                        >
                          <Share2 size={12} />
                        </button>

                        <button
                          onClick={(e) => handleSaveProperty(prop, e)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.9)',
                            border: '1px solid #cbd5e1',
                            color: isSaved ? '#E31837' : '#0f172a',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(4px)'
                          }}
                          className="hover-lift"
                          title="Save Property"
                        >
                          <Heart size={12} fill={isSaved ? '#E31837' : 'none'} />
                        </button>
                      </div>

                      {/* Price Tag */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          left: '10px',
                          background: '#0f172a',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '0.92rem'
                        }}
                      >
                        ${(prop.price || 0).toLocaleString()}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#64748b', marginBottom: '2px', fontWeight: 600 }}>
                          <span>MLS# {prop.mlsNumber || prop.id}</span>
                          <span>{prop.daysOnMarket || 3} days on market</span>
                        </div>
                        <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: '0 0 2px 0', lineHeight: '1.3' }}>
                          {prop.title}
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0, display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                          <MapPin size={11} style={{ color: '#E31837' }} />
                          <span>
                            {prop.address.toLowerCase().includes(prop.city.toLowerCase())
                              ? prop.address
                              : `${prop.address}, ${prop.city}`}
                          </span>
                        </p>
                        <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                          <span style={{ color: '#0f172a', fontWeight: 700, flexShrink: 0 }}>Brokerage:</span>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {prop.listOfficeName || 'TRREB Member Brokerage'}
                          </span>
                        </p>
                      </div>

                      {/* Smart Specs Matrix: Commercial/Land vs Residential */}
                      {prop.beds === 0 || /land|commercial|industrial|farm|office|retail/i.test(`${prop.propertyType || ''} ${(prop as any).propertySubType || ''}`) ? (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: '#334155', borderTop: '1px solid #e2e8f0', paddingTop: '6px', fontWeight: 600 }}>
                          <span style={{ color: '#0f172a', fontWeight: 700 }}>{(prop as any).propertySubType || prop.propertyType || 'Commercial / Land'}</span>
                          {prop.sqft && prop.sqft > 100 ? <span>{prop.sqft.toLocaleString()} SqFt</span> : <span style={{ color: '#64748b' }}>Prime Parcel</span>}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#334155', borderTop: '1px solid #e2e8f0', paddingTop: '6px', fontWeight: 600 }}>
                          <span>{prop.beds} Beds</span>
                          <span>•</span>
                          <span>{prop.baths} Baths</span>
                          <span>•</span>
                          <span>{(prop.sqft || 1850).toLocaleString()} SqFt</span>
                        </div>
                      )}

                      {/* Bottom Action Row (Side-by-side equal width buttons) */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #e2e8f0' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSelectPropertyFromMap(prop); }}
                          className="btn hover-lift"
                          style={{
                            flex: 1,
                            padding: '7px 10px',
                            fontSize: '0.74rem',
                            borderRadius: '8px',
                            background: isSelected ? '#0f172a' : '#f8fafc',
                            color: isSelected ? '#ffffff' : '#0f172a',
                            border: '1px solid #cbd5e1',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px'
                          }}
                        >
                          <Check size={12} style={{ opacity: isSelected ? 1 : 0.6 }} />
                          <span>{isSelected ? 'Selected' : 'Select'}</span>
                        </button>

                        <button
                          onClick={(e) => handleOpenPropertyDetail(prop.id, e)}
                          className="btn btn-primary hover-lift"
                          style={{
                            flex: 1,
                            padding: '7px 10px',
                            fontSize: '0.74rem',
                            borderRadius: '8px',
                            background: '#0f172a',
                            color: '#ffffff',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>Details</span>
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* MOBILE FLOATING TOGGLE BAR */}
      <div
        className="mobile-map-toggle"
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 90,
          background: 'rgba(7, 13, 36, 0.95)',
          border: '1px solid rgba(167, 139, 250, 0.3)',
          borderRadius: '30px',
          padding: '4px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
        }}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setMobileActiveTab('list')}
            style={{
              padding: '8px 20px',
              borderRadius: '24px',
              background: mobileActiveTab === 'list' ? 'var(--color-lavender)' : 'none',
              color: mobileActiveTab === 'list' ? '#030712' : '#ffffff',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <List size={14} />
            <span>List View</span>
          </button>

          <button
            onClick={() => setMobileActiveTab('map')}
            style={{
              padding: '8px 20px',
              borderRadius: '24px',
              background: mobileActiveTab === 'map' ? 'var(--color-lavender)' : 'none',
              color: mobileActiveTab === 'map' ? '#030712' : '#ffffff',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Map size={14} />
            <span>Map View</span>
          </button>
        </div>
      </div>

      {/* SHARE MODAL */}
      {shareProperty && (
        <ShareModal
          property={shareProperty}
          onClose={() => setShareProperty(null)}
        />
      )}

      {/* QUICK VIEW MODAL */}
      {quickViewProperty && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setQuickViewProperty(null)}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '520px',
              width: '100%',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(167, 139, 250, 0.25)',
              background: '#070d24'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ height: '220px', position: 'relative' }}>
              <img src={quickViewProperty.imageUrl} alt={quickViewProperty.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                onClick={() => setQuickViewProperty(null)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(3,7,18,0.8)',
                  border: 'none',
                  color: '#fff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <span className="badge badge-lavender" style={{ marginBottom: '8px' }}>{quickViewProperty.propertyType}</span>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: '4px 0' }}>{quickViewProperty.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{quickViewProperty.address}, {quickViewProperty.city}</p>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-lavender)', margin: '12px 0' }}>
                ${quickViewProperty.price.toLocaleString()}
              </div>
              <button
                onClick={() => {
                  setSelectedPropertyId(quickViewProperty.id);
                  setCurrentPage('property-detail');
                }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '10px', borderRadius: '10px', fontSize: '0.85rem' }}
              >
                View Full Property Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMBEDDED CSS FOR RESPONSIVE SPLIT VIEW */}
      <style>{`
        @media (max-width: 900px) {
          .search-map-panel {
            display: ${mobileActiveTab === 'map' ? 'block !important' : 'none !important'};
            width: 100% !important;
          }
          .search-results-panel {
            display: ${mobileActiveTab === 'list' ? 'flex !important' : 'none !important'};
            width: 100% !important;
          }
        }
        @media (min-width: 901px) {
          .mobile-map-toggle {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
};

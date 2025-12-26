import { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    Text,
    Checkbox,
    CheckboxGroup,
    Heading,
    Divider,
    Stack,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    Flex
} from '@chakra-ui/react';

function FilterSidebar({ filters, onFilterChange }) {
    const [priceRange, setPriceRange] = useState([
        Number(filters.minPrice) || 0,
        Number(filters.maxPrice) || 200
    ]);

    useEffect(() => {
        setPriceRange([
            Number(filters.minPrice) || 0,
            Number(filters.maxPrice) || 200
        ]);
    }, [filters.minPrice, filters.maxPrice]);

    const handleBrandChange = (selectedBrands) => {
        onFilterChange('brand', selectedBrands.join(','));
    };

    const handlePriceChangeEnd = (val) => {
        onFilterChange({
            minPrice: val[0],
            maxPrice: val[1]
        });
    };

    const brands = ["Nike", "Adidas", "Zappos Sport", "Zappos Essentials", "Puma", "Reebok"];

    return (
        <Box
            w="250px"
            p={4}
            borderRight="1px"
            borderColor="gray.200"
            position="sticky"
            top="20px"
            alignSelf="flex-start"
            display={{ base: 'none', md: 'block' }}
        >
            <VStack align="stretch" spacing={6}>
                <Box>
                    <Heading size="xs" mb={3} textTransform="uppercase">Brand</Heading>
                    <CheckboxGroup colorScheme="teal" value={filters.brand ? filters.brand.split(',') : []} onChange={handleBrandChange}>
                        <Stack spacing={2}>
                            {brands.map(brand => (
                                <Checkbox key={brand} value={brand}>{brand}</Checkbox>
                            ))}
                        </Stack>
                    </CheckboxGroup>
                </Box>

                <Divider />

                <Box>
                    <Heading size="xs" mb={3} textTransform="uppercase">Price Range</Heading>
                    <Flex justify="space-between" mb={2}>
                        <Text fontSize="sm">${priceRange[0]}</Text>
                        <Text fontSize="sm">${priceRange[1]}</Text>
                    </Flex>
                    <RangeSlider
                        aria-label={['min', 'max']}
                        value={priceRange}
                        min={0}
                        max={200}
                        step={5}
                        onChange={(val) => setPriceRange(val)}
                        onChangeEnd={handlePriceChangeEnd}
                    >
                        <RangeSliderTrack>
                            <RangeSliderFilledTrack bg="teal.500" />
                        </RangeSliderTrack>
                        <RangeSliderThumb index={0} />
                        <RangeSliderThumb index={1} />
                    </RangeSlider>
                </Box>
            </VStack>
        </Box>
    );
}

export default FilterSidebar;

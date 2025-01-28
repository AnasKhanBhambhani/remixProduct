import React, { useState } from 'react';
import { Range, getTrackBackground } from 'react-range';

type PriceRangePickerProps = {
    minPrice: number;
    maxPrice: number;
    onChange: (min: number, max: number) => void;
};

const PriceRangePicker: React.FC<PriceRangePickerProps> = ({ minPrice, maxPrice, onChange }) => {
    const [values, setValues] = useState([minPrice, maxPrice]);

    const handleChange = (newValues: number[]) => {
        setValues(newValues);
        onChange(newValues[0], newValues[1]);
    };

    return (
        <div className=' w-full'>
            <Range
                values={values}
                step={1}
                min={500}
                max={10000}
                onChange={handleChange}
                renderTrack={({ props, children }) => (
                    <div
                        {...props}
                        style={{
                            height: '6px',
                            width: '100%',
                            background: getTrackBackground({
                                values,
                                colors: ['#ccc', '#5469d4', '#ccc'],
                                min: 500,
                                max: 10000,
                            }),
                            borderRadius: '3px',
                            marginTop: '20px',
                        }}
                    >
                        {children}
                    </div>
                )}
                renderThumb={({ index, props }) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            height: '20px',
                            width: '20px',
                            borderRadius: '50%',
                            backgroundColor: '#5469d4',
                        }}
                    />
                )}
            />
            <div className='flex justify-between my-1'>
                <span>${values[0]}</span>
                <h3>Select Price Range</h3>
                <span>${values[1]}</span>
            </div>
        </div>
    );
};

export default PriceRangePicker;

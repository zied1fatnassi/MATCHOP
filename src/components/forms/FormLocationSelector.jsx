import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { TUNISIAN_GOVERNORATES, CITIES_BY_GOVERNORATE } from '../../lib/validation'
import './FormComponents.css'

/**
 * FormLocationSelector - Two-level location selector for Tunisia
 * First select governorate, then select city from that governorate
 */
export function FormLocationSelector({
    label = 'Localisation / Location',
    governorateValue,
    cityValue,
    onGovernorateChange,
    onCityChange,
    required = false,
    disabled = false,
    error = null,
    helperText = null,
}) {
    const [availableCities, setAvailableCities] = useState([])

    // Update available cities when governorate changes
    useEffect(() => {
        if (governorateValue && CITIES_BY_GOVERNORATE[governorateValue]) {
            setAvailableCities(CITIES_BY_GOVERNORATE[governorateValue])
            // Reset city if it's not in the new governorate's list
            if (cityValue && !CITIES_BY_GOVERNORATE[governorateValue].includes(cityValue)) {
                onCityChange('')
            }
        } else {
            setAvailableCities([])
            onCityChange('')
        }
    }, [governorateValue])

    const handleGovernorateChange = (value) => {
        if (onGovernorateChange) {
            onGovernorateChange(value)
        }
    }

    const handleCityChange = (value) => {
        if (onCityChange) {
            onCityChange(value)
        }
    }

    return (
        <div className="form-input-group">
            {label && (
                <label className="form-label">
                    {label}
                    {required && <span className="required-indicator"> *</span>}
                </label>
            )}

            <div className="form-location-grid">
                {/* Governorate Selector */}
                <select
                    className={`form-input ${error ? 'form-input-error' : ''}`}
                    value={governorateValue || ''}
                    onChange={(e) => handleGovernorateChange(e.target.value)}
                    required={required}
                    disabled={disabled}
                >
                    <option value="">Gouvernorat / Governorate</option>
                    {TUNISIAN_GOVERNORATES.map((gov) => (
                        <option key={gov} value={gov}>
                            {gov}
                        </option>
                    ))}
                </select>

                {/* City Selector */}
                <select
                    className={`form-input ${error ? 'form-input-error' : ''}`}
                    value={cityValue || ''}
                    onChange={(e) => handleCityChange(e.target.value)}
                    required={required}
                    disabled={disabled || !governorateValue}
                >
                    <option value="">
                        {governorateValue ? 'Ville / City' : 'Sélectionnez d\'abord un gouvernorat'}
                    </option>
                    {availableCities.map((city) => (
                        <option key={city} value={city}>
                            {city}
                        </option>
                    ))}
                </select>
            </div>

            {helperText && !error && (
                <span className="form-helper-text">{helperText}</span>
            )}
            {error && (
                <div className="form-error-message">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                </div>
            )}
        </div>
    )
}

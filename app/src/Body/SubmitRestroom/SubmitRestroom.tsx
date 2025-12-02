import { useState, type FormEvent } from 'react';
import axios from 'axios';
import type { RestroomFormData } from '../../Types/restroom.types';
import './SubmitRestroom.scss';

export function SubmitRestroom() {
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<RestroomFormData>({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    isAccessible: false,
    isGenderNeutral: false,
    hasChangingTable: false,
    directions: '',
    comments: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.street || !formData.city || !formData.state || !formData.country) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const restroomData = {
        name: formData.name,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        isAccessible: formData.isAccessible,
        isGenderNeutral: formData.isGenderNeutral,
        hasChangingTable: formData.hasChangingTable,
        comments: `${formData.directions ? 'Directions: ' + formData.directions + '. ' : ''}${formData.comments}`,
      };

      await axios.post('http://localhost:3001/api/restrooms', restroomData);
      setSuccess('Restroom submitted successfully! Thank you for contributing.');

      setFormData({
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
        isAccessible: false,
        isGenderNeutral: false,
        hasChangingTable: false,
        directions: '',
        comments: '',
      });
      setShowPreview(false);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('This restroom already exists in our database. Please check the name and address.');
      } else if (err.response?.status === 400 && err.response?.data?.message?.includes('Unable to find the location')) {
        setError('Unable to find the location for this address. Please double-check the street address, city, and state are correct.');
      } else {
        setError(err.response?.data?.message || 'Failed to submit restroom. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-restroom-container">
        
      <div className="form-section">
        
        <header className="submit-header">
        <h1>Submit a Restroom</h1>
        <p className="subtitle">Help us grow our community database of safe and accessible restrooms!</p>
        </header>

        <h2>Add New Restroom</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="restroom-form">
            <div className="form-row">
              <div className="form-group required">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Starbucks Downtown"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group required">
                <label htmlFor="street">Street Address</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="e.g., 123 Main St"
                  required
                />
              </div>
            </div>

            <div className="form-row two-columns">
              <div className="form-group required">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Nashville"
                  required
                />
              </div>

              <div className="form-group required">
                <label htmlFor="state">State/Province</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="TN"
                  required
                />
              </div>
            </div>

            <div className="form-row two-columns">
              <div className="form-group required">
                <label htmlFor="zipCode">Zip Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="37201"
                  required
                />
              </div>

              <div className="form-group required">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="USA"
                  required
                />
              </div>
            </div>

            <div className="form-section-title">Features</div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isAccessible"
                  checked={formData.isAccessible}
                  onChange={handleInputChange}
                />
                <span>Accessible (wheelchair accessible)</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isGenderNeutral"
                  checked={formData.isGenderNeutral}
                  onChange={handleInputChange}
                />
                <span>Unisex / Gender Neutral</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="hasChangingTable"
                  checked={formData.hasChangingTable}
                  onChange={handleInputChange}
                />
                <span>Changing Table</span>
              </label>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="directions">Directions</label>
                <textarea
                  id="directions"
                  name="directions"
                  value={formData.directions}
                  onChange={handleInputChange}
                  placeholder="How to find this restroom (e.g., 'On the second floor, near the elevator')"
                  rows={3}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="comments">Additional Comments</label>
                <textarea
                  id="comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  placeholder="Any other helpful information"
                  rows={3}
                />
              </div>
            </div>

            <div className="button-group">
              <button type="button" onClick={handlePreview} className="preview-button">
                Preview
              </button>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Submitting...' : 'Save Restroom'}
              </button>
            </div>
          </form>
      </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="preview-modal" onClick={() => setShowPreview(false)}>
            <div className="preview-content" onClick={(e) => e.stopPropagation()}>
              <h2>Preview</h2>
              <div className="preview-details">
                <div className="preview-item">
                  <strong>Name:</strong> {formData.name}
                </div>
                <div className="preview-item">
                  <strong>Address:</strong> {formData.street}, {formData.city}, {formData.state} {formData.zipCode}
                </div>
                <div className="preview-item">
                  <strong>Country:</strong> {formData.country}
                </div>
                <div className="preview-item">
                  <strong>Features:</strong>
                  <div className="preview-tags">
                    {formData.isAccessible && <span className="tag">Accessible</span>}
                    {formData.isGenderNeutral && <span className="tag">Unisex</span>}
                    {formData.hasChangingTable && <span className="tag">Changing Table</span>}
                    {!formData.isAccessible && !formData.isGenderNeutral && !formData.hasChangingTable && (
                      <span>None selected</span>
                    )}
                  </div>
                </div>
                {formData.directions && (
                  <div className="preview-item">
                    <strong>Directions:</strong> {formData.directions}
                  </div>
                )}
                {formData.comments && (
                  <div className="preview-item">
                    <strong>Comments:</strong> {formData.comments}
                  </div>
                )}
              </div>
              <button onClick={() => setShowPreview(false)} className="close-preview">
                Close Preview
              </button>
            </div>
          </div>
        )}
    </div>
  );
}

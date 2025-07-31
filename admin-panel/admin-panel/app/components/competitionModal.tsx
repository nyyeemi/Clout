import {useState} from 'react';

import Modal from '@mui/material/Modal';

type CreateCompetitionPayload = {
  category: string;
  description: string;
  start_time: string;
  vote_start_time: string;
  end_time: string;
};

const toUTCISOString = (value: string) => new Date(value).toISOString();

export default function CompetitionModal({
  showAddForm,
  setShowAddForm,
  onSubmit,
}: {
  showAddForm: boolean;
  setShowAddForm: (val: boolean) => void;
  onSubmit: (data: CreateCompetitionPayload) => void;
}) {
  const [formData, setFormData] = useState<CreateCompetitionPayload>({
    category: '',
    description: '',
    start_time: '',
    vote_start_time: '',
    end_time: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      start_time: toUTCISOString(formData.start_time),
      vote_start_time: toUTCISOString(formData.vote_start_time),
      end_time: toUTCISOString(formData.end_time),
    });
    setShowAddForm(false);
  };

  return (
    <Modal
      open={showAddForm}
      onClose={() => setShowAddForm(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <div className="flex items-center justify-center h-screen">
        <form
          onSubmit={handleFormSubmit}
          className="bg-neutral-900 text-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
          <h2 className="text-lg font-semibold">Create Competition</h2>

          <div className="flex flex-col gap-1">
            <label htmlFor="category" className="text-sm text-neutral-300">
              Category
            </label>
            <input
              name="category"
              required
              type="text"
              value={formData.category}
              onChange={handleChange}
              className="bg-neutral-800 border border-neutral-600 text-sm p-2 rounded text-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-sm text-neutral-300">
              Description
            </label>
            <input
              name="description"
              required
              type="text"
              value={formData.description}
              onChange={handleChange}
              className="bg-neutral-800 border border-neutral-600 text-sm p-2 rounded text-white"
            />
          </div>

          {['start_time', 'vote_start_time', 'end_time'].map(name => (
            <div key={name} className="flex flex-col gap-1">
              <label
                htmlFor={name}
                className="text-sm capitalize text-neutral-300">
                {name.replaceAll('_', ' ')}
              </label>
              <input
                name={name}
                required
                type="datetime-local"
                value={formData[name as keyof CreateCompetitionPayload]}
                onChange={handleChange}
                className="bg-neutral-800 border border-neutral-600 text-sm p-2 rounded text-white"
              />
            </div>
          ))}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 text-sm text-white bg-neutral-700 hover:bg-neutral-600 rounded">
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-sm text-white bg-blue-700 hover:bg-blue-800 rounded">
              Create
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

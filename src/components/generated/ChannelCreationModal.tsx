"use client";

import React, { useState } from 'react';
import { X, Hash, Lock, Globe, Users, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface ChannelCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChannel: (channel: {
    name: string;
    description: string;
    type: 'public' | 'private';
  }) => void;
}
export const ChannelCreationModal = ({
  isOpen,
  onClose,
  onCreateChannel
}: ChannelCreationModalProps) => {
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [channelType, setChannelType] = useState<'public' | 'private'>('public');
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
  }>({});
  const validateChannelName = (name: string) => {
    if (!name.trim()) {
      return 'Channel name is required';
    }
    if (name.length < 2) {
      return 'Channel name must be at least 2 characters';
    }
    if (name.length > 21) {
      return 'Channel name must be 21 characters or less';
    }
    if (!/^[a-z0-9-_]+$/.test(name)) {
      return 'Channel names can only contain lowercase letters, numbers, hyphens, and underscores';
    }
    if (name.startsWith('-') || name.endsWith('-')) {
      return 'Channel names cannot start or end with hyphens';
    }
    return null;
  };
  const handleNameChange = (value: string) => {
    // Auto-format: lowercase, replace spaces with hyphens
    const formatted = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');
    setChannelName(formatted);
    const error = validateChannelName(formatted);
    setErrors(prev => ({
      ...prev,
      name: error || undefined
    }));
  };
  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (value.length > 250) {
      setErrors(prev => ({
        ...prev,
        description: 'Description must be 250 characters or less'
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        description: undefined
      }));
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameError = validateChannelName(channelName);
    const descError = description.length > 250 ? 'Description must be 250 characters or less' : null;
    if (nameError || descError) {
      setErrors({
        name: nameError || undefined,
        description: descError || undefined
      });
      return;
    }
    onCreateChannel({
      name: channelName,
      description,
      type: channelType
    });

    // Reset form
    setChannelName('');
    setDescription('');
    setChannelType('public');
    setErrors({});
    onClose();
  };
  const handleClose = () => {
    setChannelName('');
    setDescription('');
    setChannelType('public');
    setErrors({});
    onClose();
  };
  return <AnimatePresence>
      {isOpen && <>
          {/* Backdrop */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleClose}>
            {/* Modal */}
            <motion.div initial={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }} animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }} exit={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }} transition={{
          type: "spring",
          duration: 0.3
        }} className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Create a channel
                </h2>
                <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Channel Type Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Channel type
                  </label>
                  <div className="space-y-2">
                    <button type="button" onClick={() => setChannelType('public')} className={`w-full flex items-start space-x-3 p-4 rounded-lg border-2 transition-all ${channelType === 'public' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className={`p-1 rounded ${channelType === 'public' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        <Hash className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">Public</span>
                          <Globe className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Anyone in your workspace can join
                        </p>
                      </div>
                    </button>

                    <button type="button" onClick={() => setChannelType('private')} className={`w-full flex items-start space-x-3 p-4 rounded-lg border-2 transition-all ${channelType === 'private' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className={`p-1 rounded ${channelType === 'private' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        <Lock className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">Private</span>
                          <Users className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Only invited members can join
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Channel Name */}
                <div className="space-y-2">
                  <label htmlFor="channel-name" className="block text-sm font-medium text-gray-700">
                    Channel name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {channelType === 'public' ? <Hash className="w-5 h-5 text-gray-400" /> : <Lock className="w-5 h-5 text-gray-400" />}
                    </div>
                    <input id="channel-name" type="text" value={channelName} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. marketing-team" className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.name ? 'border-red-300' : 'border-gray-300'}`} maxLength={21} />
                  </div>
                  {errors.name && <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.name}</span>
                    </div>}
                  <p className="text-xs text-gray-500">
                    Names must be lowercase, without spaces or periods, and shorter than 22 characters.
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description <span className="text-gray-400">(optional)</span>
                  </label>
                  <textarea id="description" value={description} onChange={e => handleDescriptionChange(e.target.value)} placeholder="What's this channel about?" rows={3} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${errors.description ? 'border-red-300' : 'border-gray-300'}`} maxLength={250} />
                  {errors.description && <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.description}</span>
                    </div>}
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Help others understand what this channel is for</span>
                    <span>{description.length}/250</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={!channelName.trim() || !!errors.name || !!errors.description} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">
                    Create Channel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>}
    </AnimatePresence>;
};
/**
 * Patient Dashboard Component
 * 
 * A comprehensive patient dashboard for viewing prescriptions and downloading PDFs
 * Features:
 * - View all patient prescriptions
 * - Download prescription PDFs
 * - Professional medical design
 * - Responsive layout
 * - Real-time data from backend
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Calendar,
  Download,
  FileText,
  Pill,
  User,
  Stethoscope,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchPrescriptionsByPatient, type Prescription } from '@/services/api';
import { generatePrescriptionPDF } from '@/utils/pdfGenerator';

const PatientDashboard: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patientEmail, setPatientEmail] = useState('alice.johnson@student.ruet.ac.bd'); // Demo email
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Fetch prescriptions function
  const fetchPrescriptions = async (showRefreshLoader = false) => {
    if (showRefreshLoader) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const patientPrescriptions = await fetchPrescriptionsByPatient(patientEmail);
      setPrescriptions(patientPrescriptions);

      if (showRefreshLoader) {
        toast({
          title: "Prescriptions Updated",
          description: "Your prescription list has been refreshed.",
        });
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load prescriptions';
      setError(errorMessage);

      toast({
        title: "Error Loading Prescriptions",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch prescriptions on component mount
  useEffect(() => {
    if (patientEmail) {
      fetchPrescriptions();
    }
  }, [patientEmail]);

  // Auto-refresh prescriptions every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (patientEmail && !isLoading && !isRefreshing) {
        fetchPrescriptions(true);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [patientEmail, isLoading, isRefreshing]);

  // Filter prescriptions based on search term
  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle PDF download
  const handleDownloadPDF = (prescription: Prescription) => {
    try {
      generatePrescriptionPDF(prescription);
      
      toast({
        title: "PDF Downloaded",
        description: `Prescription PDF for ${prescription.patientName} has been downloaded.`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      toast({
        title: "Download Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-medical-medium border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Prescriptions</h2>
          <p className="text-gray-500">Fetching your medical prescriptions...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Prescriptions</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-medical-medium hover:bg-medical-dark text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-medical-medium rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">My Prescriptions</h1>
                <p className="text-gray-600">View and download your medical prescriptions</p>
              </div>
            </div>

            <Button
              onClick={() => fetchPrescriptions(true)}
              disabled={isRefreshing || isLoading}
              variant="outline"
              className="border-medical-medium text-medical-medium hover:bg-medical-medium hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          {/* Patient Info */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-medical-medium" />
              <div>
                <p className="text-sm font-medium text-gray-700">Patient Email</p>
                <p className="text-base font-semibold text-gray-900">{patientEmail}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search prescriptions by doctor, diagnosis, or symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </motion.div>

        {/* Prescriptions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filteredPrescriptions.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  {prescriptions.length === 0 ? 'No Prescriptions Found' : 'No Matching Prescriptions'}
                </h3>
                <p className="text-gray-500">
                  {prescriptions.length === 0 
                    ? 'You don\'t have any prescriptions yet.' 
                    : 'Try adjusting your search terms.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredPrescriptions.map((prescription, index) => (
                <motion.div
                  key={prescription._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-medical-medium">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-medical-light rounded-full flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-medical-dark" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-gray-800">{prescription.doctorName}</CardTitle>
                            <p className="text-sm text-gray-600">RUET Medical Center</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-medical-medium" />
                            <span>{formatDate(prescription.date)}</span>
                          </div>
                          <Button
                            onClick={() => handleDownloadPDF(prescription)}
                            className="bg-medical-medium hover:bg-medical-dark text-white"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Diagnosis */}
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Diagnosis:</Label>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm">
                          {prescription.diagnosis}
                        </p>
                      </div>

                      {/* Symptoms */}
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Symptoms:</Label>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm">
                          {prescription.symptoms}
                        </p>
                      </div>

                      {/* Medications */}
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Pill className="w-4 h-4 text-medical-medium" />
                          Prescribed Medications ({prescription.medications.length})
                        </Label>
                        <div className="space-y-2">
                          {prescription.medications.map((medication, medIndex) => (
                            <div key={medIndex} className="bg-white border border-gray-200 rounded-lg p-3">
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                                <div>
                                  <span className="font-medium text-gray-700">{medication.name}</span>
                                </div>
                                <div className="text-gray-600">
                                  <span className="font-medium">Dosage:</span> {medication.dosage}
                                </div>
                                <div className="text-gray-600">
                                  <span className="font-medium">Frequency:</span> {medication.frequency}
                                </div>
                                <div className="text-gray-600">
                                  <span className="font-medium">Duration:</span> {medication.duration}
                                </div>
                              </div>
                              {medication.instructions && (
                                <div className="mt-2 text-xs text-gray-500">
                                  <span className="font-medium">Instructions:</span> {medication.instructions}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Advice */}
                      {prescription.advice && (
                        <div>
                          <Label className="text-sm font-semibold text-gray-700 mb-2 block">Medical Advice:</Label>
                          <p className="text-gray-600 bg-blue-50 p-3 rounded-lg text-sm">
                            {prescription.advice}
                          </p>
                        </div>
                      )}

                      {/* Follow-up */}
                      {prescription.followUpDate && (
                        <div>
                          <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-medical-medium" />
                            Follow-up:
                          </Label>
                          <Badge variant="outline" className="text-medical-medium border-medical-medium">
                            {prescription.followUpDate}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDashboard;

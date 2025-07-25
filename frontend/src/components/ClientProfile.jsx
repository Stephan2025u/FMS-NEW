import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Calendar, Mail, Phone, Briefcase, User, Plus, TrendingUp, Loader2 } from "lucide-react";
import { clientAPI, testResultAPI } from "../services/api";
import { useToast } from "../hooks/use-toast";

const ClientProfile = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClientData();
  }, [clientId]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch client and test results in parallel
      const [clientData, testResultsData] = await Promise.all([
        clientAPI.getClient(clientId),
        testResultAPI.getClientTestResults(clientId)
      ]);
      
      setClient(clientData);
      setTestResults(testResultsData);
    } catch (error) {
      console.error('Error fetching client data:', error);
      setError('Failed to load client data. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load client data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getScoreColor = (score) => {
    if (score >= 17) return "bg-green-100 text-green-800";
    if (score >= 14) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg text-gray-700">Loading client data...</span>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="text-center py-8">
            <p className="text-red-500 mb-4">{error || "Client not found"}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate("/")} variant="outline">
                Return to Dashboard
              </Button>
              <Button onClick={fetchClientData} className="bg-blue-600 hover:bg-blue-700 text-white">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="hover:bg-white/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-gray-600">Client Profile & Test History</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Client Information */}
          <div className="lg:col-span-1">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{client.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="font-medium">{calculateAge(client.date_of_birth)} years</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Occupation</p>
                    <p className="font-medium">{client.occupation || 'Not specified'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Total Tests</span>
                    <span className="font-bold text-blue-600">{client.total_tests || 0}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Latest Score</span>
                    {client.latest_score ? (
                      <Badge className={`${getScoreColor(client.latest_score)} border-0`}>
                        {client.latest_score}/21
                      </Badge>
                    ) : (
                      <span className="text-gray-500">No tests yet</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Test</span>
                    <span className="font-medium">
                      {client.last_test_date ? formatDate(client.last_test_date) : "No tests yet"}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => navigate(`/test/${client.id}`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New FMS Test
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Test History */}
          <div className="lg:col-span-2">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Test History
                </CardTitle>
                <CardDescription>
                  FMS assessment results over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {testResults.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No test results yet</p>
                    <Button
                      onClick={() => navigate(`/test/${client.id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Conduct First Test
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testResults.map((test) => (
                      <Card key={test.id} className="border border-gray-200 bg-white/50">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">
                                Test - {formatDate(test.test_date)}
                              </CardTitle>
                              <CardDescription>
                                Total Score: {test.total_score}/21
                              </CardDescription>
                            </div>
                            <Badge className={`${getScoreColor(test.total_score)} border-0`}>
                              {test.total_score}/21
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {Object.entries(test.scores).map(([exerciseKey, exerciseData]) => (
                              <div key={exerciseKey} className="text-center">
                                <div className="text-2xl font-bold text-blue-600 mb-1">
                                  {exerciseData.score}
                                </div>
                                <div className="text-xs text-gray-600 capitalize">
                                  {exerciseKey.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                                {exerciseData.pain && (
                                  <div className="text-xs text-red-600 mt-1">⚠ Pain</div>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          {test.assessor_notes && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                Assessor Notes:
                              </p>
                              <p className="text-sm text-gray-600">{test.assessor_notes}</p>
                            </div>
                          )}
                          
                          <div className="flex justify-end mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/results/${test.id}`)}
                              className="bg-white/50 border-gray-300 hover:bg-white/80"
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
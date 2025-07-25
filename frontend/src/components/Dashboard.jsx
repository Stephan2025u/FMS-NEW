import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Users, TrendingUp, Calendar } from "lucide-react";
import { mockClients } from "../data/mockData";
import AddClientModal from "./AddClientModal";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [clients, setClients] = useState(mockClients);
  const navigate = useNavigate();

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addClient = (newClient) => {
    const client = {
      ...newClient,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      totalTests: 0,
      latestScore: null,
      lastTestDate: null
    };
    setClients([...clients, client]);
    setShowAddModal(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No tests yet";
    return new Date(dateString).toLocaleDateString();
  };

  const getScoreColor = (score) => {
    if (score >= 17) return "bg-green-100 text-green-800";
    if (score >= 14) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            FMS Assessment Dashboard
          </h1>
          <p className="text-gray-600">
            Functional Movement Screen testing and client management
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{clients.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {clients.reduce((sum, client) => sum + client.totalTests, 0)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Tests</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {clients.filter(client => client.lastTestDate).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Add Client */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/70 backdrop-blur-sm border-0 shadow-lg"
            />
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>

        {/* Client List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {client.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {client.email}
                    </CardDescription>
                  </div>
                  {client.latestScore && (
                    <Badge className={`${getScoreColor(client.latestScore)} border-0`}>
                      {client.latestScore}/21
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Tests:</span>
                    <span className="font-medium">{client.totalTests}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Test:</span>
                    <span className="font-medium">{formatDate(client.lastTestDate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Occupation:</span>
                    <span className="font-medium">{client.occupation}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/client/${client.id}`)}
                    className="flex-1 bg-white/50 border-gray-300 hover:bg-white/80"
                  >
                    View Profile
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/test/${client.id}`)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    New Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No clients found matching your search.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddClient={addClient}
      />
    </div>
  );
};

export default Dashboard;
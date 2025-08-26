"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { CheckCircle, XCircle, Clock, Eye, FileText, User, Building, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminVerificationsPage() {
  const { user, isLoaded } = useUser()
  const [verifications, setVerifications] = useState<any[]>([])
  const [verificationStats, setVerificationStats] = useState({
    total: 0,
    pending: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
  })
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("pending")
  const [selectedVerification, setSelectedVerification] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const fetchVerifications = async () => {
    try {
      const response = await fetch('/api/admin/verifications')
      if (response.ok) {
        const data = await response.json()
        setVerifications(data.data || [])
        setVerificationStats(data.stats || verificationStats)
      }
    } catch (error) {
      console.error('Failed to fetch verifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.publicMetadata?.role === 'admin') {
      fetchVerifications()
    } else {
      setLoading(false)
    }
  }, [user])

  const handleVerificationAction = async (verificationId: string, action: string, notes?: string) => {
    try {
      const response = await fetch('/api/admin/verifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: verificationId,
          status: action,
          notes: notes
        })
      })

      if (response.ok) {
        // Refresh the verifications list
        await fetchVerifications()
        alert(`Verification ${action} successfully!`)
      } else {
        alert('Failed to update verification')
      }
    } catch (error) {
      console.error('Error updating verification:', error)
      alert('Failed to update verification')
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default'
      case 'rejected':
        return 'destructive'
      case 'under_review':
        return 'secondary'
      case 'pending':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      case 'under_review':
        return <Eye className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredVerifications = verifications.filter(verification => {
    if (selectedTab === "all") return true
    return verification.status === selectedTab
  })

  if (!isLoaded || loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!user || user.publicMetadata?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
      </div>
    )
  }

  const openDetailsModal = (verification: any) => {
    console.log('Verification documents:', verification.documents)
    setSelectedVerification(verification)
    setShowDetailsModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Verification Management</h1>
        <p className="text-muted-foreground">
          Review and approve partner applications and property listings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-primary">{verificationStats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{verificationStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Under Review</p>
                <p className="text-2xl font-bold text-blue-600">{verificationStats.underReview}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{verificationStats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{verificationStats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verifications */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pending">Pending ({verificationStats.pending})</TabsTrigger>
          <TabsTrigger value="under_review">Under Review ({verificationStats.underReview})</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab}>
          <div className="space-y-4">
            {filteredVerifications.map((verification) => (
              <Card key={verification.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        {verification.type === 'partner' ? (
                          <User className="h-6 w-6 text-primary" />
                        ) : (
                          <Building className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{verification.businessName}</h3>
                          <Badge variant={getStatusBadgeVariant(verification.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(verification.status)}
                              <span>{verification.status.replace('_', ' ')}</span>
                            </div>
                          </Badge>
                          <Badge variant="outline">
                            {verification.type}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Applicant:</span>
                            <span className="ml-2 font-medium">{verification.applicantName}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Email:</span>
                            <span className="ml-2">{verification.email}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Phone:</span>
                            <span className="ml-2">{verification.phone}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Location:</span>
                            <span className="ml-2">{verification.location}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Property Type:</span>
                            <span className="ml-2">{verification.propertyType}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Submitted:</span>
                            <span className="ml-2">{verification.submittedDate}</span>
                          </div>
                        </div>

                        {verification.notes && (
                          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                            <span className="text-sm font-medium">Notes: </span>
                            <span className="text-sm text-muted-foreground">{verification.notes}</span>
                          </div>
                        )}

                        <div className="mt-4">
                          <span className="text-sm font-medium">Documents: </span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {Object.entries(verification.documents).map(([key, value]) => (
                              <Badge key={key} variant="outline" className="text-xs">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openDetailsModal(verification)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      
                      {verification.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerificationAction(verification.id, 'under_review')}
                            className="text-blue-600 hover:text-blue-600"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleVerificationAction(verification.id, 'approve')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerificationAction(verification.id, 'reject')}
                            className="text-destructive hover:text-destructive"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}

                      {verification.status === 'under_review' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleVerificationAction(verification.id, 'approve')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerificationAction(verification.id, 'reject')}
                            className="text-destructive hover:text-destructive"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredVerifications.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No verifications found</h3>
                <p className="text-muted-foreground">
                  No verifications match the current filter
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Verification Details</DialogTitle>
          </DialogHeader>
          {selectedVerification && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Business Information</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium">Business Name:</span> {selectedVerification.businessName}</div>
                    <div><span className="font-medium">Applicant:</span> {selectedVerification.applicantName}</div>
                    <div><span className="font-medium">Email:</span> {selectedVerification.email}</div>
                    <div><span className="font-medium">Phone:</span> {selectedVerification.phone}</div>
                    <div><span className="font-medium">Location:</span> {selectedVerification.location}</div>
                    <div><span className="font-medium">Property Type:</span> {selectedVerification.propertyType}</div>
                    <div><span className="font-medium">Status:</span> 
                      <Badge variant={getStatusBadgeVariant(selectedVerification.status)} className="ml-2">
                        {selectedVerification.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div><span className="font-medium">Submitted:</span> {selectedVerification.submittedDate}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Documents</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedVerification.documents || {}).length > 0 ? 
                      Object.entries(selectedVerification.documents).map(([key, value]) => (
                      <div key={key} className="border rounded-lg p-3">
                        <div className="text-sm font-medium mb-2">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </div>
                        {value && typeof value === 'string' && value.trim() !== '' ? (
                          value.startsWith('http') || value.startsWith('data:') || value.includes('cloudinary') ? (
                            <div className="space-y-2">
                              <img 
                                src={value} 
                                alt={key}
                                className="w-full h-32 object-cover rounded cursor-pointer border hover:opacity-80 transition-opacity"
                                onClick={() => window.open(value, '_blank')}
                                onError={(e) => {
                                  console.log('Image failed to load:', value)
                                  e.currentTarget.style.display = 'none'
                                  e.currentTarget.nextElementSibling!.textContent = 'Failed to load image'
                                }}
                              />
                              <div className="text-xs text-center text-muted-foreground">
                                Click to view full size
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground bg-muted p-2 rounded text-center">
                              Document: {String(value)}
                            </div>
                          )
                        ) : (
                          <div className="text-xs text-muted-foreground bg-muted p-2 rounded text-center">
                            No document uploaded
                          </div>
                        )}
                      </div>
                    )) : (
                      // Fallback message when no documents
                      <div className="col-span-2 text-center text-muted-foreground p-4 border rounded-lg">
                        No documents uploaded yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedVerification.notes && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Admin Notes</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    {selectedVerification.notes}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

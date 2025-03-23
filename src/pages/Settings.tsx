
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getData, storeData } from '@/services/mockData';
import { Stage } from '@/types';
import { defaultStages } from '@/services/mockData';
import { Save, Plus, Trash, RefreshCcw } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [stages, setStages] = useState<Stage[]>(getData<Stage[]>('stages', defaultStages));
  const [newStage, setNewStage] = useState<Omit<Stage, 'id'>>({
    name: '',
    type: 'screening' as const,
    order: stages.length,
    color: '#3b82f6',
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveStages = () => {
    // Validate stages
    const names = new Set<string>();
    for (const stage of stages) {
      if (!stage.name.trim()) {
        toast.error('All stages must have a name');
        return;
      }
      
      if (names.has(stage.name.toLowerCase())) {
        toast.error(`Duplicate stage name: ${stage.name}`);
        return;
      }
      
      names.add(stage.name.toLowerCase());
    }
    
    // Update the order
    const orderedStages = stages.map((stage, index) => ({
      ...stage,
      order: index,
    }));
    
    // Save to local storage
    storeData('stages', orderedStages);
    setStages(orderedStages);
    toast.success('Application stages updated');
    setIsEditing(false);
  };

  const handleAddStage = () => {
    if (!newStage.name.trim()) {
      toast.error('Stage name is required');
      return;
    }
    
    const newId = Math.random().toString(36).substring(2, 10);
    const stageToAdd: Stage = {
      ...newStage,
      id: newId,
    };
    
    setStages([...stages, stageToAdd]);
    setNewStage({
      name: '',
      type: 'screening',
      order: stages.length + 1,
      color: '#3b82f6',
    });
  };

  const handleRemoveStage = (id: string) => {
    if (stages.length <= 2) {
      toast.error('You must have at least two stages');
      return;
    }
    
    setStages(stages.filter(stage => stage.id !== id));
  };

  const handleUpdateStage = (id: string, field: keyof Stage, value: string) => {
    setStages(stages.map(stage => 
      stage.id === id ? { ...stage, [field]: value } : stage
    ));
  };

  const handleResetStages = () => {
    setStages([...defaultStages]);
    toast.success('Stages reset to default');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application settings</p>
      </div>

      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="application">Application Process</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue={user?.company} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue={user?.role} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => toast.success('Account information updated')}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => toast.success('Password updated successfully')}>
                <Save className="mr-2 h-4 w-4" />
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="application" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Application Stages</CardTitle>
                  <CardDescription>Customize the stages of your application process</CardDescription>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveStages}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" onClick={handleResetStages}>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                      <Button onClick={() => setIsEditing(true)}>
                        Edit Stages
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop stages to reorder them. All existing applications will keep their current stages.
                    </p>
                    
                    <div className="space-y-2">
                      {stages.map((stage) => (
                        <div key={stage.id} className="flex items-center gap-2 p-2 border rounded-md">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: stage.color }}
                          />
                          <Input
                            value={stage.name}
                            onChange={(e) => handleUpdateStage(stage.id, 'name', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            type="color"
                            value={stage.color}
                            onChange={(e) => handleUpdateStage(stage.id, 'color', e.target.value)}
                            className="w-10 p-1 h-10"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveStage(stage.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Input
                        placeholder="New Stage Name"
                        value={newStage.name}
                        onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
                      />
                      <Input
                        type="color"
                        value={newStage.color}
                        onChange={(e) => setNewStage({ ...newStage, color: e.target.value })}
                        className="w-10 p-1 h-10"
                      />
                      <Button onClick={handleAddStage}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {stages.map((stage) => (
                      <div 
                        key={stage.id} 
                        className="px-3 py-1 rounded-full border" 
                        style={{ 
                          backgroundColor: `${stage.color}20`, 
                          borderColor: stage.color,
                          color: stage.color
                        }}
                      >
                        {stage.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Scoring Criteria</CardTitle>
              <CardDescription>Define how applications are scored</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Scoring is based on the weights assigned to fields in your application forms.
                  You can assign weights to fields when creating or editing a form.
                </p>
                
                <div className="space-y-2">
                  <div className="bg-muted p-4 rounded-md">
                    <h4 className="font-medium mb-2">Eligibility Thresholds</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="min-score">Minimum Eligibility Score (%)</Label>
                        <Input id="min-score" type="number" defaultValue="60" min="0" max="100" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="auto-reject">Auto-Reject Below (%)</Label>
                        <Input id="auto-reject" type="number" defaultValue="30" min="0" max="100" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => toast.success('Scoring criteria updated')}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure when and how you receive email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="new-applications" className="flex-1">
                    New applications received
                  </Label>
                  <select
                    id="new-applications"
                    className="p-2 border rounded-md"
                    defaultValue="instant"
                  >
                    <option value="instant">Instantly</option>
                    <option value="daily">Daily Digest</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                <Separator />
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="stage-changes" className="flex-1">
                    Application stage changes
                  </Label>
                  <select
                    id="stage-changes"
                    className="p-2 border rounded-md"
                    defaultValue="daily"
                  >
                    <option value="instant">Instantly</option>
                    <option value="daily">Daily Digest</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                <Separator />
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="job-applications" className="flex-1">
                    Send notifications to candidates when their application status changes
                  </Label>
                  <select
                    id="job-applications"
                    className="p-2 border rounded-md"
                    defaultValue="yes"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => toast.success('Notification preferences updated')}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

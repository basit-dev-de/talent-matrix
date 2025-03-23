import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Save,
  Trash,
  GripVertical,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getJobById } from "@/services/mockData";
import { getFormByJobId, createForm, updateForm } from "@/services/formService";
import { Job, CustomForm, FormSection, FormField, FieldType } from "@/types";
import { generateId, initializeMockData } from "@/services/mockData";

const FormBuilder = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [form, setForm] = useState<CustomForm | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [sections, setSections] = useState<FormSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    initializeMockData();

    if (!jobId) return;

    const jobData = getJobById(jobId);
    if (jobData) {
      setJob(jobData);

      const existingForm = getFormByJobId(jobId);
      if (existingForm) {
        setForm(existingForm);
        setFormName(existingForm.name);
        setFormDescription(existingForm.description || "");
        setSections(existingForm.sections);
      } else {
        const defaultSections: FormSection[] = [
          {
            id: generateId(),
            title: "Personal Information",
            description: "Tell us about yourself",
            fields: [
              {
                id: generateId(),
                type: "text",
                label: "Full Name",
                placeholder: "Enter your full name",
                required: true,
              },
              {
                id: generateId(),
                type: "text",
                label: "Email",
                placeholder: "Enter your email",
                required: true,
              },
            ],
          },
          {
            id: generateId(),
            title: "Resume",
            fields: [
              {
                id: generateId(),
                type: "file",
                label: "Resume/CV",
                required: true,
              },
            ],
          },
        ];

        setSections(defaultSections);
        setFormName(`${jobData.title} Application Form`);
        setFormDescription(
          `Please fill out this application for our ${jobData.title} position.`
        );
      }

      const baseUrl = window.location.origin;
      setShareUrl(`${baseUrl}/apply/${jobId}`);
    }

    setLoading(false);
  }, [jobId]);

  const handleBackClick = () => {
    navigate(`/jobs/${jobId}`);
  };

  const handleFormNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormName(e.target.value);
  };

  const handleFormDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormDescription(e.target.value);
  };

  const addSection = () => {
    const newSection: FormSection = {
      id: generateId(),
      title: "New Section",
      fields: [],
    };

    setSections([...sections, newSection]);
  };

  const updateSection = (id: string, updates: Partial<FormSection>) => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, ...updates } : section
      )
    );
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter((section) => section.id !== id));
    toast.success("Section deleted");
  };

  const addField = (sectionId: string) => {
    const newField: FormField = {
      id: generateId(),
      type: "text",
      label: "New Field",
      required: false,
    };

    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            fields: [...(section.fields || []), newField],
          };
        }
        return section;
      })
    );
  };

  const updateField = (
    sectionId: string,
    fieldId: string,
    updates: Partial<FormField>
  ) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            fields: section.fields?.map((field) =>
              field.id === fieldId ? { ...field, ...updates } : field
            ),
          };
        }
        return section;
      })
    );
  };

  const deleteField = (sectionId: string, fieldId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            fields: section.fields?.filter((field) => field.id !== fieldId),
          };
        }
        return section;
      })
    );
  };

  const saveForm = () => {
    if (!jobId || !job) return;

    const formData: CustomForm = {
      id: form?.id || generateId(),
      jobId,
      name: formName,
      description: formDescription,
      sections,
      createdAt: form?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (form) {
      updateForm(form.id, formData);
      toast.success("Form updated successfully");
    } else {
      createForm(formData);
      setForm(formData);
      toast.success("Form created successfully");
    }
  };

  const handleTogglePreview = () => {
    setPreviewMode(!previewMode);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">Loading...</div>
    );
  }

  if (!job) {
    return <div className="p-8">Job not found</div>;
  }

  return (
    <div className="container max-w-6xl py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBackClick}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Job
          </Button>
          <h1 className="text-2xl font-bold">
            {previewMode ? "Preview Form" : "Form Builder"}
          </h1>
          <Badge variant="outline" className="ml-2">
            {job.title}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2 mr-4">
            <Switch
              id="preview-mode"
              checked={previewMode}
              onCheckedChange={handleTogglePreview}
            />
            <Label htmlFor="preview-mode">Preview Mode</Label>
          </div>
          <Button onClick={saveForm} disabled={previewMode}>
            <Save className="mr-2 h-4 w-4" />
            Save Form
          </Button>
        </div>
      </div>

      {!previewMode ? (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Form Settings</CardTitle>
              <CardDescription>
                Configure the basic settings for your application form
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="form-name">Form Name</Label>
                  <Input
                    id="form-name"
                    value={formName}
                    onChange={handleFormNameChange}
                    placeholder="Enter form name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="form-description">Form Description</Label>
                  <Textarea
                    id="form-description"
                    value={formDescription}
                    onChange={handleFormDescriptionChange}
                    placeholder="Enter form description"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Form Sections</h2>
            <Button onClick={addSection} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </div>

          {sections.map((section, index) => (
            <Card key={section.id} className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Input
                        value={section.title || ""}
                        onChange={(e) =>
                          updateSection(section.id, { title: e.target.value })
                        }
                        className="text-lg font-semibold h-8 w-auto min-w-[200px]"
                      />
                      <Badge variant="outline">
                        {(section.fields || []).length} fields
                      </Badge>
                    </div>
                    <div>
                      <Input
                        value={section.description || ""}
                        onChange={(e) =>
                          updateSection(section.id, {
                            description: e.target.value,
                          })
                        }
                        placeholder="Add section description (optional)"
                        className="text-sm text-muted-foreground h-7"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteSection(section.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <div className="cursor-move">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {(section.fields || []).length > 0 ? (
                  <div className="space-y-4">
                    {section.fields?.map((field) => (
                      <div
                        key={field.id}
                        className="flex items-start gap-4 p-3 border rounded-md"
                      >
                        <div className="cursor-move mt-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                          <div className="space-y-2">
                            <Label>Field Type</Label>
                            <Select
                              value={field.type}
                              onValueChange={(value) =>
                                updateField(section.id, field.id, {
                                  type: value as FieldType,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="phone">Phone</SelectItem>
                                <SelectItem value="textarea">
                                  Long Text
                                </SelectItem>
                                <SelectItem value="select">Dropdown</SelectItem>
                                <SelectItem value="radio">
                                  Radio Buttons
                                </SelectItem>
                                <SelectItem value="checkbox">
                                  Checkbox
                                </SelectItem>
                                <SelectItem value="file">
                                  File Upload
                                </SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Label</Label>
                            <Input
                              value={field.label || ""}
                              onChange={(e) =>
                                updateField(section.id, field.id, {
                                  label: e.target.value,
                                })
                              }
                              placeholder="Field label"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Placeholder</Label>
                            <Input
                              value={field.placeholder || ""}
                              onChange={(e) =>
                                updateField(section.id, field.id, {
                                  placeholder: e.target.value,
                                })
                              }
                              placeholder="Field placeholder"
                              disabled={[
                                "file",
                                "radio",
                                "checkbox",
                                "date",
                              ].includes(field.type)}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`required-${field.id}`}
                              checked={field.required || false}
                              onCheckedChange={(checked) =>
                                updateField(section.id, field.id, {
                                  required: checked,
                                })
                              }
                            />
                            <Label htmlFor={`required-${field.id}`}>
                              Required
                            </Label>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteField(section.id, field.id)}
                            className="mt-1"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <HelpCircle className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-4">
                      No fields added to this section yet.
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => addField(section.id)}
                  variant="outline"
                  className="mt-4 w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Field
                </Button>
              </CardContent>
            </Card>
          ))}

          {sections.length === 0 && (
            <Card className="mb-6">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <HelpCircle className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground mb-4">
                  Your form doesn't have any sections yet. Add a section to get
                  started.
                </p>
                <Button onClick={addSection} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Section
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end mt-6">
            <Button onClick={saveForm}>
              <Save className="mr-2 h-4 w-4" />
              Save Form
            </Button>
          </div>
        </>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{formName}</CardTitle>
            {formDescription && (
              <CardDescription>{formDescription}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {sections.map((section, index) => (
              <div key={section.id} className="space-y-4">
                <h3 className="text-lg font-semibold">{section.title}</h3>
                {section.description && (
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                )}
                <Separator />

                <div className="space-y-4">
                  {section.fields?.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={`preview-${field.id}`}>
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </Label>

                      {field.type === "text" && (
                        <Input
                          id={`preview-${field.id}`}
                          placeholder={field.placeholder}
                          disabled
                        />
                      )}

                      {field.type === "email" && (
                        <Input
                          id={`preview-${field.id}`}
                          type="email"
                          placeholder={field.placeholder}
                          disabled
                        />
                      )}

                      {field.type === "phone" && (
                        <Input
                          id={`preview-${field.id}`}
                          type="tel"
                          placeholder={field.placeholder}
                          disabled
                        />
                      )}

                      {field.type === "textarea" && (
                        <Textarea
                          id={`preview-${field.id}`}
                          placeholder={field.placeholder}
                          disabled
                        />
                      )}

                      {field.type === "select" && (
                        <Select disabled>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                field.placeholder || "Select an option"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="option1">Option 1</SelectItem>
                            <SelectItem value="option2">Option 2</SelectItem>
                            <SelectItem value="option3">Option 3</SelectItem>
                          </SelectContent>
                        </Select>
                      )}

                      {field.type === "file" && (
                        <Input
                          id={`preview-${field.id}`}
                          type="file"
                          disabled
                        />
                      )}

                      {field.type === "date" && (
                        <Input
                          id={`preview-${field.id}`}
                          type="date"
                          disabled
                        />
                      )}

                      {field.type === "checkbox" && (
                        <div className="flex items-center space-x-2">
                          <input
                            id={`preview-${field.id}`}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            disabled
                          />
                          <label
                            htmlFor={`preview-${field.id}`}
                            className="text-sm"
                          >
                            Checkbox option
                          </label>
                        </div>
                      )}

                      {field.type === "radio" && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              id={`preview-${field.id}-1`}
                              type="radio"
                              name={`preview-${field.id}`}
                              className="h-4 w-4 border-gray-300"
                              disabled
                            />
                            <label
                              htmlFor={`preview-${field.id}-1`}
                              className="text-sm"
                            >
                              Option 1
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              id={`preview-${field.id}-2`}
                              type="radio"
                              name={`preview-${field.id}`}
                              className="h-4 w-4 border-gray-300"
                              disabled
                            />
                            <label
                              htmlFor={`preview-${field.id}-2`}
                              className="text-sm"
                            >
                              Option 2
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {sections.length > 0 && (
              <div className="pt-4">
                <Button disabled>Submit Application</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {shareUrl && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Share Form</CardTitle>
            <CardDescription>
              Use this URL to share the application form
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex">
              <Input value={shareUrl} readOnly />
              <Button
                variant="outline"
                className="ml-2"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast.success("URL copied to clipboard");
                }}
              >
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FormBuilder;

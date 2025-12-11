import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  // Category Icons
  Briefcase, CreditCard, GraduationCap, Scale, Heart, Tv, Plane, Home, 
  Palette, Cpu, ShoppingBag, Users, User, Archive, Folder,
  // UI Icons - ADDED ArrowLeft, MessageCircle, Mail, Send here
  FileText, MoreVertical, Trash2, Download, Search, File, Loader2, 
  RefreshCw, Eye, ArrowUpRight, ArrowLeft, Share2, Copy, Check, Sparkles, Calendar, HardDrive,
  MessageCircle, Mail, Send
} from "lucide-react";
import { toast } from "sonner";
import apiClient from '@/lib/apiClient';

interface FileRecord {
  id: number;
  original_filename: string;
  category: string;
  file_size_bytes: number;
  upload_date: string;
  summary: string;
  match_score?: number;
}

function MyFilesView() {
  const [allFiles, setAllFiles] = useState<FileRecord[]>([]);
  const [displayedFiles, setDisplayedFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState("date-desc");

  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const [fileToDelete, setFileToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [fileToShare, setFileToShare] = useState<number | null>(null);
  const [sharePassword, setSharePassword] = useState("");
  const [shareDays, setShareDays] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/files');
      setAllFiles(response.data);
      setDisplayedFiles(response.data);
      setSelectedCategory(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setDisplayedFiles(allFiles);
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.get(`/search`, { params: { query: searchQuery } });
      setDisplayedFiles(response.data);
      setSelectedCategory(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const categories = allFiles.reduce((acc, file) => {
    const cat = file.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery("");
    const filtered = allFiles.filter(f => (f.category || "Uncategorized") === category);
    setDisplayedFiles(filtered);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setDisplayedFiles(allFiles);
  };

  const getCategoryTheme = (category: string) => {
    const cat = category.toLowerCase();
    switch (cat) {
      case 'work': case 'career': return { color: 'blue', icon: Briefcase };
      case 'finance': return { color: 'emerald', icon: CreditCard };
      case 'education': return { color: 'indigo', icon: GraduationCap };
      case 'legal': return { color: 'slate', icon: Scale };
      case 'health': return { color: 'rose', icon: Heart };
      case 'entertainment': return { color: 'violet', icon: Tv };
      case 'travel': return { color: 'sky', icon: Plane };
      case 'household': return { color: 'amber', icon: Home };
      case 'creative': return { color: 'pink', icon: Palette };
      case 'technical': return { color: 'cyan', icon: Cpu };
      case 'shopping': return { color: 'orange', icon: ShoppingBag };
      case 'social': return { color: 'teal', icon: Users };
      case 'personal': return { color: 'fuchsia', icon: User };
      case 'archival': return { color: 'stone', icon: Archive };
      default: return { color: 'gray', icon: Folder };
    }
  };

  useEffect(() => {
    let sorted = [...displayedFiles];
    switch (sortOrder) {
      case "date-desc": sorted.sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime()); break;
      case "date-asc": sorted.sort((a, b) => new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime()); break;
      case "name-asc": sorted.sort((a, b) => a.original_filename.localeCompare(b.original_filename)); break;
      case "size-desc": sorted.sort((a, b) => b.file_size_bytes - a.file_size_bytes); break;
    }
    if (JSON.stringify(sorted) !== JSON.stringify(displayedFiles)) {
        setDisplayedFiles(sorted);
    }
  }, [sortOrder, displayedFiles.length, selectedCategory]); 

  const handleDownload = async (file: FileRecord) => {
    setProcessingId(file.id);
    try {
      const response = await apiClient.get(`/files/${file.id}/download`);
      const link = document.createElement('a');
      link.href = response.data.download_url;
      link.setAttribute('download', file.original_filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Downloading "${file.original_filename}"...`);
    } catch (error) {
      toast.error("Failed to download file. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const confirmDelete = (fileId: number) => {
    setFileToDelete(fileId);
    setIsDeleteDialogOpen(true);
  };

  const executeDelete = async () => {
    if (!fileToDelete) return;
    setProcessingId(fileToDelete);
    setIsDeleteDialogOpen(false); 
    try {
      await apiClient.delete(`/files/${fileToDelete}`);
      const remaining = allFiles.filter(f => f.id !== fileToDelete);
      setAllFiles(remaining);
      setDisplayedFiles(prev => prev.filter(f => f.id !== fileToDelete));
      localStorage.removeItem('dashboard_cache');
      setIsSheetOpen(false); 
      toast.success("File deleted permanently.");
    } catch (error) {
      toast.error("Could not delete file.");
    } finally {
      setProcessingId(null);
      setFileToDelete(null);
    }
  };

  const openShareDialog = (fileId: number) => {
    setFileToShare(fileId);
    setSharePassword("");
    setShareDays("");
    setGeneratedLink("");
    setIsCopied(false);
    setIsShareDialogOpen(true);
  };

  const generateShareLink = async () => {
    if (!fileToShare) return;
    try {
      const payload: any = {};
      if (sharePassword) payload.password = sharePassword;
      if (shareDays) payload.expires_in_days = parseInt(shareDays);

      const response = await apiClient.post(`/files/${fileToShare}/share`, payload);
      setGeneratedLink(response.data.share_url);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to create share link.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.info("Link copied to clipboard");
  };

  
  const shareToWhatsApp = () => {
    const fileObj = allFiles.find(f => f.id === fileToShare);
    const text = `Here is the secure link to download "${fileObj?.original_filename}":`;
    const url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + generatedLink)}`;
    window.open(url, '_blank');
  };

  const shareToEmail = () => {
    const fileObj = allFiles.find(f => f.id === fileToShare);
    const subject = `Shared File: ${fileObj?.original_filename}`;
    const body = `I am sharing a secure link to download "${fileObj?.original_filename}".\n\nLink: ${generatedLink}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const shareToTelegram = () => {
    const fileObj = allFiles.find(f => f.id === fileToShare);
    const text = `Download "${fileObj?.original_filename}" here:`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(generatedLink)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const openDetails = (file: FileRecord) => {
    setSelectedFile(file);
    setIsSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Files</h1>
          <p className="text-muted-foreground">
            {selectedCategory ? `Viewing ${selectedCategory} documents` : "Manage and organize your documents."}
          </p>
        </div>
        <div className="flex items-center gap-2">
            {(selectedCategory || (displayedFiles.length !== allFiles.length && !loading)) && (
                <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to All
                </Button>
            )}
            <Button onClick={fetchFiles} variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
            </Button>
        </div>
      </div>

      {/* --- INNOVATIVE COMPACT CARD LAYOUT --- */}
      {!selectedCategory && !searchQuery && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Object.entries(categories).map(([cat, count]) => {
                const theme = getCategoryTheme(cat);
                const Icon = theme.icon;
                
                const colorMap: any = {
                    blue:    "from-blue-50 to-white text-blue-600 border-blue-100 hover:border-blue-300",
                    emerald: "from-emerald-50 to-white text-emerald-600 border-emerald-100 hover:border-emerald-300",
                    indigo:  "from-indigo-50 to-white text-indigo-600 border-indigo-100 hover:border-indigo-300",
                    rose:    "from-rose-50 to-white text-rose-600 border-rose-100 hover:border-rose-300",
                    violet:  "from-violet-50 to-white text-violet-600 border-violet-100 hover:border-violet-300",
                    sky:     "from-sky-50 to-white text-sky-600 border-sky-100 hover:border-sky-300",
                    amber:   "from-amber-50 to-white text-amber-600 border-amber-100 hover:border-amber-300",
                    pink:    "from-pink-50 to-white text-pink-600 border-pink-100 hover:border-pink-300",
                    cyan:    "from-cyan-50 to-white text-cyan-600 border-cyan-100 hover:border-cyan-300",
                    orange:  "from-orange-50 to-white text-orange-600 border-orange-100 hover:border-orange-300",
                    teal:    "from-teal-50 to-white text-teal-600 border-teal-100 hover:border-teal-300",
                    fuchsia: "from-fuchsia-50 to-white text-fuchsia-600 border-fuchsia-100 hover:border-fuchsia-300",
                    stone:   "from-stone-50 to-white text-stone-600 border-stone-200 hover:border-stone-300",
                    slate:   "from-slate-50 to-white text-slate-600 border-slate-200 hover:border-slate-300",
                    gray:    "from-gray-50 to-white text-gray-600 border-gray-200 hover:border-gray-300",
                };

                const style = colorMap[theme.color] || colorMap.gray;

                return (
                  <Card 
                      key={cat} 
                      className={`
                        group relative cursor-pointer overflow-hidden transition-all duration-300
                        border shadow-sm hover:shadow-lg hover:-translate-y-1 rounded-xl
                        bg-gradient-to-br ${style}
                        dark:from-slate-900 dark:to-slate-950 dark:border-slate-800 dark:text-slate-200
                      `}
                      onClick={() => handleCategoryClick(cat)}
                  >
                      <CardContent className="p-4 flex flex-col justify-between h-28">
                          <div className="flex justify-between items-start">
                              <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                                  <Icon className="w-5 h-5" />
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-muted-foreground">
                                  <ArrowUpRight className="w-4 h-4" />
                              </div>
                          </div>
                          <div>
                              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                                {count} {count === 1 ? 'file' : 'files'}
                              </div>
                              <h3 className="font-bold text-lg leading-none tracking-tight">
                                  {cat}
                              </h3>
                          </div>
                      </CardContent>
                  </Card>
                );
            })}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-950 p-4 rounded-lg border">
        <div className="flex w-full sm:max-w-md gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Smart search (e.g., 'invoices from last week')" 
                    className="pl-8" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Search"}
            </Button>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
            <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="date-desc">Date (Newest)</SelectItem>
                    <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="size-desc">Size (Largest)</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {displayedFiles.length === 0 && !loading ? (
            <div className="text-center py-12 text-muted-foreground">
              <File className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No files found.</p>
              <Button variant="link" onClick={clearFilters}>Clear filters</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden md:table-cell">Size</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedFiles.map((file) => (
                  <TableRow key={file.id} className="group">
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex flex-col cursor-pointer" onClick={() => openDetails(file)}>
                                <span className="truncate max-w-[150px] md:max-w-[300px] hover:text-blue-600 transition-colors" title={file.original_filename}>
                                    {file.original_filename}
                                </span>
                                <span className="md:hidden text-xs text-muted-foreground">
                                    {(file.file_size_bytes / 1024 / 1024).toFixed(2)} MB • {file.category}
                                </span>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                            <Badge variant="outline" className="w-fit">{file.category || "Uncategorized"}</Badge>
                            {file.match_score && (
                                <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full w-fit">
                                    {(file.match_score * 100).toFixed(0)}% Match
                                </span>
                            )}
                        </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        {(file.file_size_bytes / 1024 / 1024).toFixed(2)} MB
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                        {new Date(file.upload_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            {processingId === file.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openDetails(file)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openShareDialog(file.id)}>
                            <Share2 className="mr-2 h-4 w-4" /> Share
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(file)}>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => confirmDelete(file.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto sm:max-w-xl p-0 gap-0 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-xl">
            <div className="p-6 bg-white dark:bg-slate-900 border-b">
                <SheetHeader className="text-left space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="h-12 w-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <FileText className="h-6 w-6" />
                        </div>
                        {selectedFile && (
                            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                {selectedFile.category || "Uncategorized"}
                            </Badge>
                        )}
                    </div>
                    <div className="space-y-2">
                        <SheetTitle className="text-2xl font-bold leading-tight break-all text-slate-900 dark:text-slate-50">
                            {selectedFile?.original_filename}
                        </SheetTitle>
                        {selectedFile && (
                           <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                               <div className="flex items-center gap-1.5">
                                   <HardDrive className="w-4 h-4" /> 
                                   {(selectedFile.file_size_bytes / 1024 / 1024).toFixed(2)} MB
                               </div>
                               <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                               <div className="flex items-center gap-1.5">
                                   <Calendar className="w-4 h-4" /> 
                                   {new Date(selectedFile.upload_date).toLocaleDateString()}
                               </div>
                           </div>
                        )}
                    </div>
                </SheetHeader>
            </div>
            {selectedFile && (
                <div className="p-6 space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                            <Sparkles className="w-4 h-4" /> 
                            Smart Analysis
                        </div>
                        <Card className="border-0 shadow-lg shadow-indigo-100/50 dark:shadow-none bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/50 ring-1 ring-indigo-100 dark:ring-slate-800">
                            <CardContent className="p-5 leading-relaxed text-slate-700 dark:text-slate-300 text-sm">
                                {selectedFile.summary || <span className="italic text-slate-400">Analysis pending...</span>}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="pt-4 space-y-3">
                        <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 dark:shadow-none font-semibold" onClick={() => openShareDialog(selectedFile.id)}>
                            <Share2 className="w-4 h-4 mr-2" /> Share File
                        </Button>
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" size="lg" className="w-full bg-white dark:bg-slate-900" onClick={() => handleDownload(selectedFile)}>
                                <Download className="w-4 h-4 mr-2" /> Download
                            </Button>
                            <Button variant="outline" size="lg" className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:bg-slate-900 dark:text-red-400" onClick={() => handleDelete(selectedFile.id)}>
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </SheetContent>
      </Sheet>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share File</DialogTitle>
            <DialogDescription>Create a secure public link.</DialogDescription>
          </DialogHeader>
          
          {!generatedLink ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" class="text-right">Password</Label>
                <Input
                  id="password" type="password" placeholder="(Optional)" className="col-span-3"
                  value={sharePassword} onChange={(e) => setSharePassword(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="days" class="text-right">Expires In</Label>
                <Input
                  id="days" type="number" placeholder="Days (Optional)" className="col-span-3"
                  value={shareDays} onChange={(e) => setShareDays(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Input defaultValue={generatedLink} readOnly />
                </div>
                <Button type="submit" size="sm" className="px-3" onClick={copyToClipboard}>
                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex flex-col h-auto py-3 gap-1 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors" 
                    onClick={shareToWhatsApp}
                  >
                      <div className="p-2 bg-green-100 text-green-600 rounded-full">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-slate-600">WhatsApp</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="flex flex-col h-auto py-3 gap-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors" 
                    onClick={shareToEmail}
                  >
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-slate-600">Email</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="flex flex-col h-auto py-3 gap-1 hover:bg-sky-50 hover:text-sky-500 hover:border-sky-200 transition-colors" 
                    onClick={shareToTelegram}
                  >
                      <div className="p-2 bg-sky-100 text-sky-500 rounded-full">
                        <Send className="w-4 h-4 -ml-0.5 mt-0.5" />
                      </div>
                      <span className="text-xs font-medium text-slate-600">Telegram</span>
                  </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            {!generatedLink ? (
                <Button onClick={generateShareLink}>Generate Link</Button>
            ) : (
                <Button variant="secondary" onClick={() => setIsShareDialogOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete File</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

export default MyFilesView;
import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, UserRole } from "@/lib/auth-context";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const BRANCHES = ["AI", "CSE", "ECM", "EEE", "ME", "CE", "DS"];
const FACULTY_DOMAINS = ["Artificial Intelligence", "Machine Learning", "Data Science", "IoT", "Blockchain", "Cybersecurity", "Robotics", "Web Development", "Cloud Computing"];
const FACULTY_POSITIONS = ["Assistant Professor", "Associate Professor", "Professor", "HOD", "Dean"];

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [branch, setBranch] = useState("");
  const [facultyDomain, setFacultyDomain] = useState("");
  const [facultyPosition, setFacultyPosition] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const generatedEmail = useMemo(() => {
    if (role === "student" && rollNumber) {
      return `${rollNumber.toLowerCase()}@mahindrauniversity.edu.in`;
    }
    return email;
  }, [role, rollNumber, email]);

  const rollNumberPattern = /^SE23U[A-Z]{2,3}\d{3}$/;
  const isRollNumberValid = !rollNumber || rollNumberPattern.test(rollNumber);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "student" && !rollNumberPattern.test(rollNumber)) return;
    setIsLoading(true);

    const finalEmail = role === "student" ? generatedEmail : email;
    const result = await register({
      name,
      email: finalEmail,
      password,
      role,
      rollNumber: role === "student" ? rollNumber : undefined,
      branch: role === "student" ? branch : undefined,
      domain: role === "faculty" ? facultyDomain : undefined,
      position: role === "faculty" ? facultyPosition : undefined,
    });

    setIsLoading(false);
    if (result.error) {
      toast({ title: "Registration failed", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "You can now sign in." });
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-foreground relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-primary/50 blur-3xl" />
        </div>
        <div className="relative z-10 px-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-8">
            <GraduationCap className="w-9 h-9 text-primary-foreground" />
          </div>
          <h1 className="font-display text-4xl font-bold text-background mb-4">Join CollabSphere</h1>
          <p className="text-background/60 text-lg max-w-md">
            Create your account and start exploring academic project opportunities.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">CollabSphere</span>
          </div>

          <h2 className="font-display text-2xl font-bold text-foreground mb-1">Create an account</h2>
          <p className="text-muted-foreground mb-8">Join CollabSphere to start collaborating</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
              {(["student", "faculty"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 rounded-md text-sm font-medium capitalize transition-all
                    ${role === r ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            {role === "student" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input
                    id="rollNumber"
                    placeholder="SE23UCSE001"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                    required
                  />
                  {rollNumber && !isRollNumberValid && (
                    <p className="text-xs text-destructive">Format: SE23Uxxxyyy (e.g. SE23UCSE001)</p>
                  )}
                  {rollNumber && isRollNumberValid && (
                    <p className="text-xs text-muted-foreground">Email: {generatedEmail}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Select value={branch} onValueChange={setBranch} required>
                    <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                    <SelectContent>
                      {BRANCHES.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {role === "faculty" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@mahindrauniversity.edu.in" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label>Domain</Label>
                  <Select value={facultyDomain} onValueChange={setFacultyDomain} required>
                    <SelectTrigger><SelectValue placeholder="Select domain" /></SelectTrigger>
                    <SelectContent>
                      {FACULTY_DOMAINS.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Position</Label>
                  <Select value={facultyPosition} onValueChange={setFacultyPosition} required>
                    <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
                    <SelectContent>
                      {FACULTY_POSITIONS.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

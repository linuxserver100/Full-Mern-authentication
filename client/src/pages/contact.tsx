import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Helmet } from "react-helmet";
import { Mail, Phone, MapPin, Loader2, Check } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log(data);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      toast({
        title: "Message sent",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      
      form.reset();
    }, 1500);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>Contact Us | Authentication System</title>
        <meta name="description" content="Get in touch with our team for support or questions about our authentication system." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
              <p className="text-lg text-center text-gray-600 mb-12">
                Have questions or need assistance? Reach out to our team.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <div className="mx-auto rounded-full bg-primary-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Email</h3>
                  <p className="text-gray-600">support@authsystem.com</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <div className="mx-auto rounded-full bg-primary-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Phone className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <div className="mx-auto rounded-full bg-primary-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Office</h3>
                  <p className="text-gray-600">123 Auth Street, Secure City, 12345</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                  
                  {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mb-4">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Message Sent Successfully!</h3>
                      <p className="text-gray-600 mb-6">
                        Thank you for reaching out. We'll get back to you as soon as possible.
                      </p>
                      <Button onClick={() => setIsSuccess(false)}>Send Another Message</Button>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="your@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input placeholder="How can we help you?" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Please provide details about your inquiry..." 
                                  className="min-h-[120px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Send Message"
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

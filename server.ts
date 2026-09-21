import express from "express";
import path from "path";
import fs from "fs";
import JSZip from "jszip";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Direct ZIP download of the complete Farha codebase
app.get("/api/download-zip", async (req, res) => {
  try {
    const zip = new JSZip();
    const rootDir = process.cwd();
    const ignoreDirs = new Set(["node_modules", "dist", ".git", ".cache", ".npm"]);

    function addDirectory(currentDir: string, archivePrefix = "") {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        if (ignoreDirs.has(entry.name)) continue;
        const fullPath = path.join(currentDir, entry.name);
        const archivePath = archivePrefix ? `${archivePrefix}/${entry.name}` : entry.name;

        if (entry.isDirectory()) {
          addDirectory(fullPath, archivePath);
        } else if (entry.isFile()) {
          try {
            const data = fs.readFileSync(fullPath);
            zip.file(archivePath, data);
          } catch (e) {
            console.warn(`Could not read file ${fullPath}:`, e);
          }
        }
      }
    }

    addDirectory(rootDir);

    const buffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="farha-events-iraq.zip"',
      "Content-Length": buffer.length.toString(),
    });

    res.send(buffer);
  } catch (err: any) {
    console.error("Failed to generate zip:", err);
    res.status(500).json({ error: "Failed to generate zip download" });
  }
});

// Endpoint to list and read source code files for the in-app code explorer
app.get("/api/codebase", (req, res) => {
  try {
    const rootDir = process.cwd();
    const filesToRead = [
      "package.json",
      "server.ts",
      "src/types.ts",
      "src/App.tsx",
      "src/main.tsx",
      "src/index.css",
      "src/data/farhaData.ts",
      "src/components/FarhaNavbar.tsx",
      "src/components/HeroSection.tsx",
      "src/components/CategoryPackagesView.tsx",
      "src/components/InteractiveCostCalculator.tsx",
      "src/components/BookingModal.tsx",
      "src/components/FarhaAIAssistantModal.tsx",
      "src/components/PortfolioGallery.tsx",
      "src/components/CustomerReviewsSection.tsx",
      "src/components/MyBookingsModal.tsx",
      "src/components/FarhaFooter.tsx",
      "index.html",
      "vite.config.ts"
    ];

    const result = filesToRead.map((relPath) => {
      const fullPath = path.join(rootDir, relPath);
      let content = "";
      let exists = false;
      if (fs.existsSync(fullPath)) {
        exists = true;
        content = fs.readFileSync(fullPath, "utf-8");
      }
      return {
        path: relPath,
        name: path.basename(relPath),
        exists,
        content,
        size: content.length,
      };
    }).filter(f => f.exists);

    res.json({ success: true, files: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to load codebase" });
  }
});

// Initialize Google GenAI client if GEMINI_API_KEY exists
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Helper to generate content with automatic model fallback
async function generateContentWithFailover(prompt: string, isJson = true): Promise<string> {
  const ai = getAIClient();
  if (!ai) throw new Error("AI client not available");

  const candidateModels = [
    "gemini-3.7-flash",
    "gemini-3.1-flash-lite",
  ];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: isJson ? { responseMimeType: "application/json" } : undefined,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error("All AI models are currently busy");
}

// 1. Farha AI Event Planner & Creative Consultant (مستشار فرحة الذكي لتنسيق المناسبات)
app.post("/api/farha/event-planner", async (req, res) => {
  try {
    const { message, eventType, budget, guestsCount, city } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: "يرجى كتابة استفسارك أو رغبتك في الحفل" });
    }

    const prompt = `أنت "مستشار فرحة الذكي لتنسيق وتنظيم المناسبات في العراق" (Farha Event Planner AI).
أنت خبير ذوق وفن وتصميم حفلات في العراق (أعياد ميلاد أطفال وكبار، حفلات الختان والطهور التراثية، حفلات التخرج الجامعية، وتزيين سيارات الأعراس والمناسبات).
تتميز بالنبرة العراقية الودية اللطيفة والمحترفة والمبهجة، وتقدم نصائح عملية تناسب ذوق العائلة العراقية والميزانيات بالدينار العراقي (IQD).

سياق الحفل المطلوب:
- نوع المناسبة: ${eventType || 'غير محدد'}
- الميزانية المقترحة: ${budget ? budget + ' دينار عراقي' : 'مرنة'}
- عدد الضيوف المتوقع: ${guestsCount || 'غير محدد'}
- المحافظة أو المنطقة: ${city || 'بغداد'}

طلب العميل أو سؤاله:
"${message}"

المطلوب منك:
قدم أفكاراً مبهرة تشمل:
1. فكرة الثيم (Theme) وتناسق الألوان المقترحة
2. توزيع الديكور والإضاءة
3. جدول زمني مختصر وممتع لفقرات الحفل
4. نصائح لتوفير الميزانية أو تعظيم الفرحة
5. باقة مقترحة من باقات فرحة وخدمات إضافية مناسبة

أرجع النتيجة بصيغة JSON حصراً بالشكل التالي:
{
  "reply": "نص الرد الكامل بطريقة مرتبة ومبهجة مع نقاط وتنسيق جذاب",
  "themeColors": ["اسم اللون 1", "اسم اللون 2", "اسم اللون 3"],
  "recommendedAddons": ["اسم خدمة مقترحة 1", "اسم خدمة مقترحة 2"],
  "suggestedQuestions": ["سؤال متابعة مقترح 1", "سؤال متابعة مقترح 2"]
}`;

    try {
      const jsonResponse = await generateContentWithFailover(prompt, true);
      const parsed = JSON.parse(jsonResponse);
      return res.json({
        success: true,
        reply: parsed.reply,
        themeColors: parsed.themeColors || ["ذهبي ملكي", "أبيض عاجي", "وردي باستيل"],
        recommendedAddons: parsed.recommendedAddons || ["دي جي ساوند سيستم", "أجهزة شرار بارد آمنة"],
        suggestedQuestions: parsed.suggestedQuestions || [
          "كيف أنسق الألوان مع ملابس صاحب الحفل؟",
          "ما هي أفضل الأوقات لبدء الحفلة لتجنب الحر؟",
          "هل تزيين السيارة يشمل الورد الطبيعي الهولندي؟"
        ]
      });
    } catch (aiErr) {
      console.warn("Farha AI fallback triggered:", aiErr);
      
      let fallbackReply = `أهلاً بك يا غالي في منصة فرحة! 🎈✨\n\nلتنظيم مناسبة استثنائية تسعدك وتسعد ضيوفك، إليك أهم التوصيات:\n\n1. **الثيم والألوان**: ننصح باختيار لونين أساسيين مع لمسة ذهبية أو فضية لإعطاء فخامة للصورة التذكارية.\n2. **منطقة التصوير (Photo Corner)**: هي قلب الحفل، احرص على قوس البالونات أو الاستيج مع إضاءة تسليط جيدة.\n3. **الخدمات المكملة**: جهاز الشرار البارد يعطي لحظة سينمائية عند إطفاء الشموع أو زفة الخريج، والدي جي يحرك أجواء الحفل بالكامل.\n\nفريق فرحة جاهز لتنفيذ أدق التفاصيل وتوصيلها لموقعك في أي وقت!`;
      
      if (message.includes("تخرج")) {
        fallbackReply = `مبارك التخرج مقدماً ورفع الله قدركم! 🎓🎉\n\nلحفل تخرج استثنائي يليق بالجهد:\n- **الثيم المقترح**: كحلي ملكي (Royal Blue) مع الذهبي والأسود الرخامي.\n- **الاستيج**: خلفية 3D مع كلمة GRADUATE مضيئة وروب تخرج أنيق للتصوير.\n- **لحظة التكريم**: تشغيل ماكينة الشرار البارد مع أغنية التخرج المفضلة.\n- ننصحك باختيار **باقة التخرج الملكية VIP** لضمان تغطية كاملة من التصوير للضيافة!`;
      } else if (message.includes("سيار") || message.includes("عرس") || message.includes("زفاف")) {
        fallbackReply = `ألف مبروك وبالرفاه والبنين يا رب! 🚗🌸💍\n\nلتزيين سيارة الزفاف بمظهر يخطف الأنظار:\n- نستخدم **الورد الطبيعي الهولندي الفريش** الذي يدوم طازجاً حتى ثاني يوم.\n- تثبيت آمن 100% بلواصق مغناطيسية وإسفنجية خاصة بالسيارات لحماية الصبغ واللمعان.\n- باقة البونيد مع ورد المقابض ومسكة العروس المهداة تمنح الموكب أناقة أوروبية ساحرة.\n- كادرنا الميداني يصل لباب بيتك أو قاعتك قبل الموعد بساعتين لتجهيز كل شيء بهدوء!`;
      } else if (message.includes("ختان") || message.includes("طهور")) {
        fallbackReply = `مبارك ختان البطل وجعله الله من الصالحين! 👑👶✨\n\nحفلات الختان العراقية لها نكهة خاصة وأصالة:\n- نجهز لك كوشة العرش التراثية مع طاسة الحنة المطرزة وكاسات الشمع المزخرفة.\n- نوفر دشداشة الختان الحريرية المطرزة بالاسم هدية للطفل.\n- زفة بالدفوف والدي جي البغدادي لإسعاد العائلة والضيوف.\n- احجز باقة الختان الكلاسيكية أو الملكية وسيتولى فريقنا كل الترتيبات في مجلسك أو صالتك!`;
      }

      return res.json({
        success: true,
        isFallback: true,
        reply: fallbackReply,
        themeColors: ["أزرق ملكي", "ذهبي لامع", "أبيض سحابي"],
        recommendedAddons: [
          "أجهزة شرار بارد عدد 4",
          "دي جي ساوند سستم كامل",
          "جلسة تصوير احترافية"
        ],
        suggestedQuestions: [
          "كم تكلفة باقة أعياد الميلاد الذهبية؟",
          "هل تصلون لكافة مناطق بغداد والمحافظات؟",
          "كيف أطلب باقة تزيين السيارة عند بيتي؟"
        ]
      });
    }
  } catch (error: any) {
    console.error("Farha planner error:", error);
    return res.status(500).json({ success: false, error: error?.message || "حدث خطأ أثناء معالجة الطلب" });
  }
});

// Start Server and setup Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Farha Events Platform Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

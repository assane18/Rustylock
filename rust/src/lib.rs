use wasm_bindgen::prelude::*;
use rand::Rng;
use sha2::{Sha256, Digest};
use js_sys::Date;

#[wasm_bindgen]
pub fn generate_password(
    length: usize,
    uppercase: bool,
    lowercase: bool,
    numbers: bool,
    symbols: bool,
) -> String {
    let mut charset = String::new();
    if uppercase { charset.push_str("ABCDEFGHIJKLMNOPQRSTUVWXYZ"); } // lettres majuscules
    if lowercase { charset.push_str("abcdefghijklmnopqrstuvwxyz"); } // lettres minuscules
    if numbers { charset.push_str("0123456789"); } // chiffres
    if symbols { charset.push_str("!@#$%^&*()-_=+[]{}|;:,.<>/?"); } // symboles

    let mut rng = rand::thread_rng();
    (0..length)
        .filter_map(|_| charset.chars().nth(rng.gen_range(0..charset.len())))
        .collect()
}

#[wasm_bindgen]
pub fn generate_passphrase(word_count: usize) -> String {
    let words = [
        "aube", "acier", "algue", "âme", "angle", "argile", "balai", "banc", "barre", "bijou",
        "blé", "bloc", "bois", "bulle", "cale", "camp", "carte", "chant", "chute", "clou",
        "code", "corde", "corne", "coton", "cristal", "cube", "cycle", "désert", "drift", "écho",
        "éclat", "écran", "élan", "épée", "étoile", "fable", "fiche", "fil", "flux", "forme",
        "fossé", "froid", "garde", "glace", "graine", "grêle", "harmon", "herbe", "île", "jade",
        "jet", "joyau", "lame", "lac", "laser", "liane", "limon", "lièvre", "loge", "lueur",
        "lune", "marée", "masque", "matin", "miel", "mine", "miroir", "mode", "mousse", "murmure",
        "nœud", "nuage", "ombre", "onde", "orbe", "pacte", "paroi", "perle", "pic", "plume",
        "poing", "pont", "poule", "poussière", "quartz", "rêve", "roc", "roseau", "roue", "sabre",
        "sable", "sceau", "serre", "soie", "sol", "source", "spore", "taupe", "terre", "vague",
        "val", "vase", "vent", "verre", "vigne", "voile", "volcan", "zèbre", "zeste", "zinc",
        "abri", "acide", "aile", "albe", "ancre", "arbre", "bâton", "bise", "blanc", "bois",
        "boue", "brique", "bruit", "buée", "cage", "ciel", "cime", "clou", "colle", "corail",
        "crabe", "crête", "cuve", "dé", "dent", "dune", "éclair", "éclore", "écorce", "étoile",
        "faux", "fête", "flamme", "flocon", "fouet", "frisette", "gel", "goutte", "grille",
        "guitare", "horizon", "huit", "île", "iris", "jardin", "jante", "jardin", "jouet",        
    ]; // liste simple

    let mut rng = rand::thread_rng();
    (0..word_count)
        .map(|_| words[rng.gen_range(0..words.len())])
        .collect::<Vec<&str>>()
        .join("-")
}

#[wasm_bindgen]
pub fn hash_password(pass: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(pass.as_bytes());
    format!("{:x}", hasher.finalize())
}

#[wasm_bindgen]
pub fn now_timestamp() -> f64 {
    Date::now()
}

#[wasm_bindgen]
pub fn has_expired(last: f64, duration_ms: f64) -> bool {
    Date::now() - last > duration_ms
}
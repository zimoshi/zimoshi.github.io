import re
from typing import Dict, Optional

class GPTDataParser:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.data: Dict[str, Optional[str]] = {}

    def parse(self) -> Dict[str, Optional[str]]:
        with open(self.file_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
        
        if not lines or not lines[0].startswith("#!GPTData/"):
            raise ValueError("Invalid GPTData file: Missing or incorrect shebang line.")
        
        for line in lines[1:]:  # Skip the shebang line
            line = line.strip()
            if not line or line.startswith('#'):
                continue  # Skip empty and comment lines
            
            match = re.match(r'^(\w+):\s*(".*?"|`.*?`|[^#]*)', line)
            if match:
                key, value = match.groups()
                value = value.strip()
                self.data[key] = value
                
        self.validate_syntax()
        return self.data

    def validate_syntax(self):
        if "syntax-if-statement" not in self.data:
            raise ValueError("Invalid GPTData file: Missing required 'syntax-if-statement'.")
        
        # Set defaults
        self.data.setdefault("syntax", f"""if {self.data.get("syntax-if-statement", "")}: 
    print("GPTData: Completed: No fail!")
else:
    print("GPTData: Completed: Failed.")
        """)
        self.data.setdefault("syntax-highlighting", "python-3.11.7")
        
    def display(self):
        for key, value in self.data.items():
            print(f"{key}: {value}")

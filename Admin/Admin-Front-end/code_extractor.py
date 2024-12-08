import os

def extract_code(src_path, output_file):
    # Files and folders to extract
    files_to_extract = ['App.css', 'App.js']
    folders_to_extract = ['components', 'styles', 'screens']
    excluded_folders = ['img']  # Folders to ignore

    # Open the output file for writing
    with open(output_file, 'w') as outfile:
        for file_name in files_to_extract:
            file_path = os.path.join(src_path, file_name)
            if os.path.isfile(file_path):
                outfile.write(f"// File: {file_name}\n")
                with open(file_path, 'r') as infile:
                    outfile.write(infile.read())
                outfile.write("\n\n")
        
        for folder_name in folders_to_extract:
            folder_path = os.path.join(src_path, folder_name)
            if os.path.isdir(folder_path):
                for root, _, files in os.walk(folder_path):
                    # Skip excluded folders
                    if any(excluded in root for excluded in excluded_folders):
                        continue
                    for file in files:
                        file_path = os.path.join(root, file)
                        relative_path = os.path.relpath(file_path, src_path)
                        outfile.write(f"// File: {relative_path}\n")
                        with open(file_path, 'r') as infile:
                            outfile.write(infile.read())
                        outfile.write("\n\n")

    print(f"Code extracted to {output_file}")

# Configuration
src_directory = os.path.join(os.getcwd(), "src")  # Path to the src folder
output_file = os.path.join(os.getcwd(), "code.txt")  # Path for the extracted file

# Execution
extract_code(src_directory, output_file)

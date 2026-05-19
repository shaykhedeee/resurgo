GEN = r"""
'CLIENT';

IMPORT_1 = "import {useMutation} from 'convex/react';"
IMPORT_2 = "import {api} from '../../../convex/_generated/api';"
IMPORT_3 = "import {useRouter} from 'next/navigation';"
IMPORT_4 = "import {useState, useEffect, useCallback, useRef} from 'react';"
IMPORT_5 = """import {useStoreUser} from '@/hooks/useStoreUser';"""
IMPORT_6 = """import {useUser} from '@clerk/nextjs';"""
IMPORTS = [IMPORT_1,IMPORT_2,IMPORT_3,IMPORT_4,IMPORT_5,IMPORT_6]

print("Test script runs")
print(len(IMPORTS))